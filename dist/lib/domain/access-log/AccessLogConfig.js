"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge = require("lodash.merge");
exports.defaultConfig = {
    removeTrailingSlash: true,
};
function mergeWithDefault(config) {
    if (config === undefined) {
        return exports.defaultConfig;
    }
    if (typeof config !== "object" || config === null) {
        throw new TypeError("Parameter 'config' should be a non null object");
    }
    if (config.removeTrailingSlash !== undefined && typeof config.removeTrailingSlash !== "boolean") {
        throw new TypeError("Config property removeTrailingSlash must be a boolean");
    }
    if (config.getUserData !== undefined && typeof config.getUserData !== "function") {
        throw new TypeError("Config property getUserData should be a function");
    }
    return merge({}, exports.defaultConfig, config);
}
exports.mergeWithDefault = mergeWithDefault;
//# sourceMappingURL=AccessLogConfig.js.map