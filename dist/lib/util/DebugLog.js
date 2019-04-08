"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger");
function log(...args) {
    if (Logger_1.default.configuration.debug) {
        console.log(...args);
    }
}
function error(...args) {
    if (Logger_1.default.configuration.debug) {
        console.error(...args);
    }
}
exports.default = { log, error };
//# sourceMappingURL=DebugLog.js.map