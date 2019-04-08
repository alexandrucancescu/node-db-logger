"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LogBase_1 = require("./LogBase");
const Types = mongoose_1.Schema.Types;
const LogSchema = new mongoose_1.Schema(Object.assign({}, LogBase_1.default, { level: {
        type: Types.Number,
        required: true,
    }, occurrences: {
        required: false,
        type: [Types.Date],
    }, message: {
        required: true,
        type: Types.String,
    } }), { writeConcern: { w: 0, j: false } });
exports.default = mongoose_1.model('Log', LogSchema);
//# sourceMappingURL=Log.js.map