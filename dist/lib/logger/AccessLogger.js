"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onRequestFinished = require("on-finished");
const Generic_1 = require("../util/Generic");
const RulesOverseer_1 = require("./rules/RulesOverseer");
const AccessLogConfig_1 = require("../domain/access-log/AccessLogConfig");
class AccessLogger {
    constructor(transports, rules, config) {
        AccessLogger.validateTransports(transports);
        this.transports = transports;
        this.config = AccessLogConfig_1.mergeWithDefault(config);
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
        if (!act || act.skip === true) {
            return;
        }
        const entry = {
            request: {
                method: req.method.toUpperCase(),
                path: Generic_1.cleanUrl(req.url, this.config.removeTrailingSlash),
                remote_address: Generic_1.cleanIp(req.connection.remoteAddress),
            },
            response: {
                responseTime: response_time_ms,
            }
        };
        console.log(entry);
    }
    static validateTransports(transports) {
        if (!Array.isArray(transports)) {
            throw new TypeError("Parameter 'transports' is not an array");
        }
        transports.forEach((tr, index) => {
            if (typeof tr.transport !== "function") {
                throw new TypeError(`Transport ${tr} at transports[${index}] does not implement the method 'transport'`);
            }
        });
    }
}
AccessLogger.debugLog = true;
exports.default = AccessLogger;
//# sourceMappingURL=AccessLogger.js.map