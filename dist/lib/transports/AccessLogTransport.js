"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccessLogTransport {
    constructor(skipMinder) {
        this.skipMinder = skipMinder;
    }
    transport(entry) {
        this.handleEntry(entry);
    }
}
exports.default = AccessLogTransport;
//# sourceMappingURL=AccessLogTransport.js.map