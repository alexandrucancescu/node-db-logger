"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Types = mongoose_1.Schema.Types;
const LogBaseSchema = {
    time: {
        type: Types.Date,
        required: true,
        default: Date.now,
    },
    expiresAt: {
        type: Types.Date,
        required: true,
    },
    instance: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },
};
exports.default = LogBaseSchema;
//# sourceMappingURL=LogBase.js.map