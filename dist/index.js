"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGtm = void 0;
var config_1 = require("./config");
var plugin_1 = require("./plugin");
var utils_1 = require("./utils");
var gtmPlugin;
var GTM_ID_PATTERN = /^GTM-[0-9A-Z]+$/;
/**
 * Assert that the given id is a valid GTM Container ID.
 *
 * Tested against pattern: `/^GTM-[0-9A-Z]+$/`.
 *
 * @param id A GTM Container ID.
 */
function assertIsGtmId(id) {
    if (typeof id !== "string" || !GTM_ID_PATTERN.test(id)) {
        throw new Error("GTM-ID '" + id + "' is not valid");
    }
}
/**
 * Installation procedure.
 *
 * @param Vue The Vue instance.
 * @param options Configuration options.
 */
function install(Vue, options) {
    var e_1, _a;
    if (options === void 0) { options = { id: "" }; }
    if (Array.isArray(options.id)) {
        try {
            for (var _b = __values(options.id), _c = _b.next(); !_c.done; _c = _b.next()) {
                var idOrObject = _c.value;
                if (typeof idOrObject === "string") {
                    assertIsGtmId(idOrObject);
                }
                else {
                    assertIsGtmId(idOrObject.id);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else {
        assertIsGtmId(options.id);
    }
    // Apply default configuration
    options = __assign(__assign({}, config_1.DEFAULT_CONFIG), options);
    // Add to vue prototype and also from globals
    gtmPlugin = new plugin_1.default(options.id, options);
    Vue.prototype.$gtm = Vue.gtm = gtmPlugin;
    // Handle vue-router if defined
    if (options.vueRouter) {
        initVueRouterGuard(Vue, options.vueRouter, options.ignoredViews, options.trackOnNextTick);
    }
    // Load GTM script when enabled
    if (gtmPlugin.options.enabled && gtmPlugin.options.loadScript) {
        if (Array.isArray(options.id)) {
            options.id.forEach(function (id) {
                if (typeof id === "string") {
                    utils_1.loadScript(id, options);
                }
                else {
                    var newConf = __assign({}, options);
                    if (id.queryParams != null) {
                        newConf.queryParams = __assign(__assign({}, newConf.queryParams), id.queryParams);
                    }
                    utils_1.loadScript(id.id, newConf);
                }
            });
        }
        else {
            utils_1.loadScript(options.id, options);
        }
    }
}
/**
 * Initialize the router guard.
 *
 * @param Vue The Vue instance.
 * @param vueRouter The Vue router instance to attach the guard.
 * @param ignoredViews An array of route name that will be ignored.
 * @param trackOnNextTick Whether or not to call `trackView` in `Vue.nextTick`.
 */
function initVueRouterGuard(Vue, vueRouter, ignoredViews, trackOnNextTick) {
    if (ignoredViews === void 0) { ignoredViews = []; }
    if (!vueRouter) {
        console.warn("[VueGtm]: You tried to register 'vueRouter' for vue-gtm, but 'vue-router' was not found.");
        return;
    }
    // Flatten routes name
    ignoredViews = ignoredViews.map(function (view) { return view.toLowerCase(); });
    vueRouter.afterEach(function (to) {
        var _a, _b, _c;
        // Ignore some routes
        if (typeof to.name !== "string" || ignoredViews.indexOf(to.name.toLowerCase()) !== -1) {
            return;
        }
        // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
        var name = to.meta && typeof to.meta.gtm === "string" && !!to.meta.gtm ? to.meta.gtm : to.name;
        var additionalEventData = (_b = (_a = to.meta) === null || _a === void 0 ? void 0 : _a.gtmAdditionalEventData) !== null && _b !== void 0 ? _b : {};
        var baseUrl = (_c = vueRouter.options.base) !== null && _c !== void 0 ? _c : "";
        var fullUrl = baseUrl;
        if (!fullUrl.endsWith("/")) {
            fullUrl += "/";
        }
        fullUrl += to.fullPath.startsWith("/") ? to.fullPath.substr(1) : to.fullPath;
        if (trackOnNextTick) {
            Vue.nextTick(function () {
                gtmPlugin === null || gtmPlugin === void 0 ? void 0 : gtmPlugin.trackView(name, fullUrl, additionalEventData);
            });
        }
        else {
            gtmPlugin === null || gtmPlugin === void 0 ? void 0 : gtmPlugin.trackView(name, fullUrl, additionalEventData);
        }
    });
}
var _default = { install: install };
exports.default = _default;
/**
 * Returns GTM plugin instance to be used via Composition API inside setup method.
 *
 * @returns The Vue GTM instance if the it was installed, otherwise `undefined`.
 */
function useGtm() {
    return gtmPlugin;
}
exports.useGtm = useGtm;
