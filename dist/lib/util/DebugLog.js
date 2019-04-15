"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AccessLogger_1 = require("../logger/AccessLogger");
exports.access = {
    log(...args) {
        if (AccessLogger_1.default.debugLog === true) {
            console.log(...args);
        }
    },
    error(...args) {
        if (AccessLogger_1.default.debugLog === true) {
            console.log(...args);
        }
    }
};
//# sourceMappingURL=DebugLog.js.map