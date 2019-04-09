"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AccessLogTransport_1 = require("./AccessLogTransport");
class ConsoleAccessLog extends AccessLogTransport_1.default {
    static formatResponseTime(time_ms) {
        if (time_ms < 1000) {
            return `${time_ms.toFixed(2)} ms`;
        }
        else {
            return `${(time_ms / 1000).toFixed(3)} sec`;
        }
    }
    static format(entry) {
        const responseTime = ConsoleAccessLog.formatResponseTime(entry.response.responseTime);
        return `${entry.request.method} ${entry.request.path} ${entry.response.code} ${responseTime}`;
    }
    handleEntry(entry) {
        console.log(ConsoleAccessLog.format(entry));
    }
}
exports.default = ConsoleAccessLog;
//# sourceMappingURL=ConsoleLog.js.map