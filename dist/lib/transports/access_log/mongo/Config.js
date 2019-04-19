"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superstruct_1 = require("superstruct");
const Parsing_1 = require("../../../util/Parsing");
var TransportFallback;
(function (TransportFallback) {
    TransportFallback[TransportFallback["FILE"] = 0] = "FILE";
    TransportFallback[TransportFallback["MEMORY"] = 1] = "MEMORY";
})(TransportFallback = exports.TransportFallback || (exports.TransportFallback = {}));
const TransportConfigSchema = superstruct_1.struct({
    connection: {
        user: "string?",
        pass: "string?",
        database: "string?",
        connectionString: "string"
    },
    structure: {
        projectName: "string",
        serviceName: "string?",
        instance: superstruct_1.struct.optional({
            autoDiscover: "boolean?",
            ip: "string?",
            region: "string?",
            id: "string?",
            description: "string?",
        })
    },
    keepLogsFor: "string?",
    stackBeforeStoring: "boolean?",
    stackSize: "number?",
}, {
    structure: {
        serviceName: "__default",
        instance: {
            autoDiscover: false,
            id: "__dafault",
        }
    },
    keepLogsFor: "5d",
    stackBeforeStoring: false,
    stackSize: 20,
});
function parseConfig(config) {
    const validated = TransportConfigSchema.assert(config);
    validated.keepLogsFor = Parsing_1.timeStringToMs(validated.keepLogsFor);
    if (validated.keepLogsFor === null) {
        throw TypeError(`${validated.keepLogsFor} is not a valid time representation`);
    }
    return validated;
}
exports.default = parseConfig;
//# sourceMappingURL=Config.js.map