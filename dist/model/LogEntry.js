"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["DEBUG"] = 1] = "DEBUG";
    LEVEL[LEVEL["INFO"] = 2] = "INFO";
    LEVEL[LEVEL["WARNING"] = 3] = "WARNING";
})(LEVEL = exports.LEVEL || (exports.LEVEL = {}));
const LogSchema = new mongoose_1.Schema({}, { writeConcern: { w: 0, j: false } });
exports.default = mongoose_1.model('Log', LogSchema);
//# sourceMappingURL=LogEntry.js.map