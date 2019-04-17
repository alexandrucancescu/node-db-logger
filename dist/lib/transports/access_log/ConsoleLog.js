"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleAccessLog {
    static formatResponseTime(time_ms) {
        if (time_ms < 1000) {
            return `${time_ms.toFixed(3)} ms`;
        }
        else {
            return `${(time_ms / 1000).toFixed(3)} s`;
        }
    }
    static format(entry) {
        const responseTime = ConsoleAccessLog.formatResponseTime(entry.response.responseTime);
        const code = entry.response.code;
        const color = code >= 500 ? 31 // red
            : code >= 400 ? 33 // yellow
                : code >= 300 ? 36 // cyan
                    : code >= 200 ? 32 // green
                        : 0;
        return `${entry.request.method} ${entry.request.path} \x1b[${color}m${entry.response.code}\x1b[0m ${responseTime}\n`;
    }
    transport(entry) {
        console.log(ConsoleAccessLog.format(entry));
    }
}
exports.default = ConsoleAccessLog;
//# sourceMappingURL=ConsoleLog.js.map