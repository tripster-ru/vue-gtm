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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var utils_1 = require("./utils");
/**
 * The Vue GTM Plugin main class.
 */
var VueGtmPlugin = /** @class */ (function () {
    /**
     * Constructs a new `VueGTMPlugin`.
     *
     * @param id A GTM Container ID.
     * @param options Options.
     */
    function VueGtmPlugin(id, options) {
        if (options === void 0) { options = config_1.DEFAULT_CONFIG; }
        this.id = id;
        this.options = options;
        /**
         * Whether the script is running in a browser or not.
         *
         * You can override this function if you need to.
         *
         * @returns `true` if the script runs in browser context.
         */
        this.isInBrowserContext = function () { return typeof window !== "undefined"; };
    }
    /**
     * Check if plugin is enabled.
     *
     * @returns `true` if the plugin is enabled, otherwise `false`.
     */
    VueGtmPlugin.prototype.enabled = function () {
        var _a;
        return (_a = this.options.enabled) !== null && _a !== void 0 ? _a : true;
    };
    /**
     * Enable or disable plugin.
     *
     * When enabling with this function, the script will be attached to the `document` if:
     *
     * - the script runs in browser context
     * - the `document` doesn't have the script already attached
     * - the `loadScript` option is set to `true`
     *
     * @param enabled `true` to enable, `false` to disable. Default: `true`.
     */
    VueGtmPlugin.prototype.enable = function (enabled) {
        var _this = this;
        if (enabled === void 0) { enabled = true; }
        this.options.enabled = enabled;
        if (this.isInBrowserContext() && enabled && !utils_1.hasScript() && this.options.loadScript) {
            if (Array.isArray(this.id)) {
                this.id.forEach(function (id) {
                    if (typeof id === "string") {
                        utils_1.loadScript(id, {
                            defer: _this.options.defer,
                            compatibility: _this.options.compatibility,
                            queryParams: _this.options.queryParams,
                        });
                    }
                    else {
                        utils_1.loadScript(id.id, {
                            defer: _this.options.defer,
                            compatibility: _this.options.compatibility,
                            queryParams: id.queryParams,
                        });
                    }
                });
            }
            else {
                utils_1.loadScript(this.id, {
                    defer: this.options.defer,
                    compatibility: this.options.compatibility,
                    queryParams: this.options.queryParams,
                });
            }
        }
    };
    /**
     * Check if plugin is in debug mode.
     *
     * @returns `true` if the plugin is in debug mode, otherwise `false`.
     */
    VueGtmPlugin.prototype.debugEnabled = function () {
        var _a;
        return (_a = this.options.debug) !== null && _a !== void 0 ? _a : false;
    };
    /**
     * Enable or disable debug mode.
     *
     * @param enable `true` to enable, `false` to disable.
     */
    VueGtmPlugin.prototype.debug = function (enable) {
        this.options.debug = enable;
    };
    /**
     * Returns the `window.dataLayer` array if the script is running in browser context and the plugin is enabled,
     * otherwise `false`.
     *
     * @returns The `window.dataLayer` if script is running in browser context and plugin is enabled, otherwise `false`.
     */
    VueGtmPlugin.prototype.dataLayer = function () {
        var _a;
        if (this.isInBrowserContext() && this.options.enabled) {
            return (window.dataLayer = (_a = window.dataLayer) !== null && _a !== void 0 ? _a : []);
        }
        return false;
    };
    /**
     * Track a view event with `event: "content-view"`.
     *
     * The event will only be send if the script runs in browser context and the if plugin is enabled.
     *
     * If debug mode is enabled, a "Dispatching TrackView" is logged,
     * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
     *
     * @param screenName Name of the screen passed as `"content-view-name"`.
     * @param path Path passed as `"content-name"`.
     * @param additionalEventData Additional data for the event object. `event`, `"content-name"` and `"content-view-name"` will always be overridden.
     */
    VueGtmPlugin.prototype.trackView = function (screenName, path, additionalEventData) {
        var _a;
        if (additionalEventData === void 0) { additionalEventData = {}; }
        if (this.options.debug) {
            console.log("[VueGtm]: Dispatching TrackView", { screenName: screenName, path: path });
        }
        if (this.isInBrowserContext() && this.options.enabled) {
            var dataLayer = (window.dataLayer = (_a = window.dataLayer) !== null && _a !== void 0 ? _a : []);
            dataLayer.push(__assign(__assign({}, additionalEventData), { event: "content-view", "content-name": path, "content-view-name": screenName }));
        }
    };
    /**
     * Track an event.
     *
     * The event will only be send if the script runs in browser context and the if plugin is enabled.
     *
     * If debug mode is enabled, a "Dispatching event" is logged,
     * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
     *
     * @param param0 Object that will be used for configuring the event object passed to GTM.
     * @param param0.event `event`, default to `"interaction"` when pushed to `window.dataLayer`.
     * @param param0.category Optional `category`, passed as `target`.
     * @param param0.action Optional `action`, passed as `action`.
     * @param param0.label Optional `label`, passed as `"target-properties"`.
     * @param param0.value Optional `value`, passed as `value`.
     * @param param0.noninteraction Optional `noninteraction`, passed as `"interaction-type"`.
     */
    VueGtmPlugin.prototype.trackEvent = function (_a) {
        var _b;
        if (_a === void 0) { _a = {}; }
        var event = _a.event, _c = _a.category, category = _c === void 0 ? null : _c, _d = _a.action, action = _d === void 0 ? null : _d, _e = _a.label, label = _e === void 0 ? null : _e, _f = _a.value, value = _f === void 0 ? null : _f, _g = _a.noninteraction, noninteraction = _g === void 0 ? false : _g, rest = __rest(_a, ["event", "category", "action", "label", "value", "noninteraction"]);
        if (this.options.debug) {
            console.log("[VueGtm]: Dispatching event", __assign({ event: event,
                category: category,
                action: action,
                label: label,
                value: value }, rest));
        }
        if (this.isInBrowserContext() && this.options.enabled) {
            var dataLayer = (window.dataLayer = (_b = window.dataLayer) !== null && _b !== void 0 ? _b : []);
            dataLayer.push(__assign({ event: event !== null && event !== void 0 ? event : "interaction", target: category, action: action, "target-properties": label, value: value, "interaction-type": noninteraction }, rest));
        }
    };
    return VueGtmPlugin;
}());
exports.default = VueGtmPlugin;
