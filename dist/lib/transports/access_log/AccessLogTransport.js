"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccessLogTransport {
    constructor(rulesOverseer) {
        if (new.target === AccessLogTransport) {
            throw new TypeError("Class AccessLogTransport is an abstract class and must be extended in order to create a transport");
        }
        if (typeof this.handleEntry !== "function") {
            throw new TypeError(`Class ${this.constructor.name} does not implement the required method 'handleEntry'`);
        }
        this.rulesOverseer = rulesOverseer;
    }
    transport(entry) {
        this.handleEntry(entry);
    }
}
exports.default = AccessLogTransport;
//# sourceMappingURL=AccessLogTransport.js.map