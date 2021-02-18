import { PluginObject } from "vue";
import { VueGtmUseOptions } from "./config";
import GtmPlugin from "./plugin";
declare module "vue/types/vue" {
    interface Vue {
        $gtm: GtmPlugin;
    }
    interface VueConstructor<V extends Vue = Vue> {
        gtm: GtmPlugin;
    }
}
export declare type VueGtmPlugin = PluginObject<VueGtmUseOptions>;
export { VueGtmUseOptions } from "./config";
declare const _default: VueGtmPlugin;
export default _default;
/**
 * Returns GTM plugin instance to be used via Composition API inside setup method.
 *
 * @returns The Vue GTM instance if the it was installed, otherwise `undefined`.
 */
export declare function useGtm(): GtmPlugin | undefined;
