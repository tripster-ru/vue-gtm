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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasScript = exports.loadScript = void 0;
require("url-search-params-polyfill");
/**
 * Load GTM script tag.
 *
 * @param id GTM ID.
 * @param config The config object.
 * @param initialMessageData A data to be injected to initial message.
 */
function loadScript(id, config) {
    var _a, _b, _c;
    if (config === void 0) { config = {}; }
    var doc = document;
    var script = doc.createElement("script");
    window.dataLayer = (_a = window.dataLayer) !== null && _a !== void 0 ? _a : [];
    (_b = window.dataLayer) === null || _b === void 0 ? void 0 : _b.push(__assign({ event: "gtm.js", "gtm.start": new Date().getTime() }, config.initialMessageData));
    if (!id) {
        return;
    }
    script.async = !config.defer;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    script.defer = Boolean(config.defer || config.compatibility);
    var queryString = new URLSearchParams(__assign({ id: id }, ((_c = config.queryParams) !== null && _c !== void 0 ? _c : {})));
    script.src = "https://www.googletagmanager.com/gtm.js?" + queryString;
    doc.body.appendChild(script);
}
exports.loadScript = loadScript;
/**
 * Check if GTM script is in the document.
 *
 * @returns `true` if in the `document` is a `script` with `src` containing `googletagmanager.com/gtm.js`, otherwise `false`.
 */
function hasScript() {
    return Array.from(document.getElementsByTagName("script")).some(function (script) {
        return script.src.includes("googletagmanager.com/gtm.js");
    });
}
exports.hasScript = hasScript;
