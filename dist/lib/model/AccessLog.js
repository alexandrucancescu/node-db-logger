"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LogBase_1 = require("./LogBase");
const Types = mongoose_1.Schema.Types;
const AccessLogSchema = new mongoose_1.Schema(Object.assign({}, LogBase_1.default, { responseCode: {
        type: Types.Number,
    }, responseTime: {
        type: Types.Number,
    }, ip: {
        type: Types.String,
        required: true
    }, method: {
        type: Types.String,
        required: true
    }, path: {
        type: Types.String,
        required: true,
    }, query: {
        type: Types.Mixed,
    }, headers: {
        type: Types.Mixed,
    }, userData: {
        type: Types.Mixed,
    }, error: {
        type: Types.Mixed,
    } }), { writeConcern: { w: 0, j: false } });
exports.default = mongoose_1.model('Log', AccessLogSchema);
//# sourceMappingURL=AccessLog.js.map