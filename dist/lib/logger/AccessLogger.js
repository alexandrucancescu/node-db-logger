"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onRequestFinished = require("on-finished");
const Generic_1 = require("../util/Generic");
const RulesOverseer_1 = require("./rules/RulesOverseer");
class AccessLogger {
    constructor(rules) {
        this.rulesOverseer = new RulesOverseer_1.default(rules, true);
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
        const act = this.rulesOverseer.computeRouteAct(req, res);
    }
}
AccessLogger.debugLog = true;
exports.default = AccessLogger;
//# sourceMappingURL=AccessLogger.js.map