"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccessLogTransport {
    constructor(rulesOverseer) {
        this.rulesOverseer = rulesOverseer;
    }
    transport(entry) {
        this.handleEntry(entry);
    }
}
exports.default = AccessLogTransport;
//# sourceMappingURL=AccessLogTransport.js.map