import Vue from "vue";
import { CombinedVueInstance, ExtendedVue } from "vue/types/vue";
import VueGtm from "../src/index";
import VueGtmPlugin from "../src/plugin";
import { appendAppDivToBody, cleanUpDataLayer, createAppWithComponent } from "./vue-helper";

// TODO: Find out why Vue in vue-2 is undefined

// Skip for now
describe.skip("Vue.use", () => {
  afterEach(() => {
    cleanUpDataLayer();
  });

  test("should append google tag manager script to DOM", () => {
    appendAppDivToBody();

    const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, { id: "GTM-DEMO" });

    new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });

  test("should append multiple google tag manager scripts to DOM", () => {
    appendAppDivToBody();
    const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, {
      id: [
        { id: "GTM-DEMO", queryParams: { gtm_auth: "abc123", gtm_preview: "env-1", gtm_cookies_win: "x" } },
        { id: "GTM-DEMO2", queryParams: { gtm_auth: "abc234", gtm_preview: "env-2", gtm_cookies_win: "x" } },
      ],
    });

    new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(2);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe(
      "https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&gtm_auth=abc123&gtm_preview=env-1&gtm_cookies_win=x"
    );
    expect(document.scripts.item(1)?.src).toBe(
      "https://www.googletagmanager.com/gtm.js?id=GTM-DEMO2&gtm_auth=abc234&gtm_preview=env-2&gtm_cookies_win=x"
    );
  });

  test("should not append google tag manager script to DOM if disabled", () => {
    appendAppDivToBody();

    const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, { id: "GTM-DEMO", enabled: false });

    new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);
  });

  test("should append google tag manager script to DOM after lazy enable", () => {
    appendAppDivToBody();

    const appComponent: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, { id: "GTM-DEMO", enabled: false });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(appComponent),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;
    expect(gtmPlugin).toBeDefined();

    gtmPlugin.enable(true);

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });

  test("should expose enable and enabled function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: "GTM-DEMO", enabled: false });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.enable).toBeInstanceOf(Function);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.enabled).toBeInstanceOf(Function);

    expect(gtmPlugin.enabled()).toBeFalsy();

    gtmPlugin.enable(true);
    expect(gtmPlugin.enabled()).toBeTruthy();

    gtmPlugin.enable(false);
    expect(gtmPlugin.enabled()).toBeFalsy();

    gtmPlugin.enable(true);
    expect(gtmPlugin.enabled()).toBeTruthy();
  });

  test("should expose debug functions", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: "GTM-DEMO" });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.debug).toBeInstanceOf(Function);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.debugEnabled).toBeInstanceOf(Function);

    expect(gtmPlugin.debugEnabled()).toBeFalsy();

    gtmPlugin.debug(true);
    expect(gtmPlugin.debugEnabled()).toBeTruthy();

    gtmPlugin.debug(false);
    expect(gtmPlugin.debugEnabled()).toBeFalsy();
  });

  test("should expose dataLayer function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: "GTM-DEMO" });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.dataLayer).toBeInstanceOf(Function);

    expect(gtmPlugin.dataLayer()).toEqual(window["dataLayer"]);

    gtmPlugin.enable(false);
    expect(gtmPlugin.dataLayer()).toBeFalsy();

    gtmPlugin.enable(true);
    expect(gtmPlugin.dataLayer()).toEqual(window["dataLayer"]);
  });

  test("should expose trackView function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: "GTM-DEMO" });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.trackView).toBeInstanceOf(Function);

    gtmPlugin.trackView("ScreenName", "Path");

    expect(window["dataLayer"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "gtm.js",
          "gtm.start": expect.any(Number),
        }),
        expect.objectContaining({
          "content-name": "Path",
          "content-view-name": "ScreenName",
          event: "content-view",
        }),
      ])
    );
  });

  test("should expose trackEvent function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: "GTM-DEMO" });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.trackEvent).toBeInstanceOf(Function);

    gtmPlugin.trackEvent();

    expect(window["dataLayer"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "gtm.js",
          "gtm.start": expect.any(Number),
        }),
        expect.objectContaining({
          action: null,
          event: "interaction",
          "interaction-type": false,
          target: null,
          "target-properties": null,
          value: null,
        }),
      ])
    );
  });
});
