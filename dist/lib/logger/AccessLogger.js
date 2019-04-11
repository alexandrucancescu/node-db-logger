"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onRequestFinished = require("on-finished");
const Generic_1 = require("../util/Generic");
const RulesOverseer_1 = require("../helper/RulesOverseer");
class AccessLogger {
    constructor(rules) {
        this.rulesOverseer = new RulesOverseer_1.default(rules);
    }
    get express() {
        return this.requestHandler.bind(this);
    }
    requestHandler(req, res, next) {
        const start_ms = Generic_1.getProcessTimeMs();
        onRequestFinished(req, this.requestFinished.bind(this, req, res, start_ms));
        next();
    }
    requestFinished(req, res, start_ms) {
        const response_time_ms = Generic_1.getProcessTimeMs() - start_ms;
        const matchedPaths = this.rulesOverseer.computeRouteAct(req, res);
    }
}
exports.default = AccessLogger;
//# sourceMappingURL=AccessLogger.js.map