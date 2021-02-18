import "url-search-params-polyfill";
import { VueGtmUseOptions } from "./config";
/**
 * Load GTM script tag.
 *
 * @param id GTM ID.
 * @param config The config object.
 * @param initialMessageData A data to be injected to initial message.
 */
export declare function loadScript(id: string, config?: Pick<VueGtmUseOptions, "defer" | "compatibility" | "queryParams" | "initialMessageData">): void;
/**
 * Check if GTM script is in the document.
 *
 * @returns `true` if in the `document` is a `script` with `src` containing `googletagmanager.com/gtm.js`, otherwise `false`.
 */
export declare function hasScript(): boolean;
