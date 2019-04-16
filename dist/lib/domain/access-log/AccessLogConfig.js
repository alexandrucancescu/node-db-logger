"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge = require("lodash.merge");
exports.defaultConfig = {
    removeTrailingSlash: true,
};
function mergeWithDefault(config) {
    if (!config) {
        return exports.defaultConfig;
    }
    if (typeof config !== "object") {
        throw new TypeError("Parameter 'config' should be an object");
    }
    if (config.removeTrailingSlash !== undefined && typeof config.removeTrailingSlash !== "boolean") {
        throw new TypeError("Config property removeTrailingSlash must be a boolean");
    }
    return merge({}, exports.defaultConfig, config);
}
exports.mergeWithDefault = mergeWithDefault;
//# sourceMappingURL=AccessLogConfig.js.map