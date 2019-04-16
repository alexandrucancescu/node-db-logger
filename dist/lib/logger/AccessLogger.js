"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const onRequestFinished = require("on-finished");
const Generic_1 = require("../util/Generic");
const RulesOverseer_1 = require("./rules/RulesOverseer");
const AccessLogConfig_1 = require("../domain/access-log/AccessLogConfig");
const DebugLog_1 = require("../util/DebugLog");
class AccessLogger {
    constructor(transports, rules, config) {
        AccessLogger.validateTransports(transports);
        this.transports = transports;
        this.config = AccessLogConfig_1.mergeWithDefault(config);
        this.rulesOverseer = new RulesOverseer_1.default(rules, this.config.removeTrailingSlash);
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
        const path = Generic_1.cleanUrl(req.originalUrl || req.url, this.config.removeTrailingSlash);
        const entry = {
            request: {
                method: req.method.toUpperCase(),
                path,
                remote_address: Generic_1.cleanIp(req.connection.remoteAddress),
            },
            response: {
                responseTime: response_time_ms,
                code: res.headersSent ? res.statusCode : undefined
            }
        };
        if (act.set) {
            if (act.set.request) {
                if (act.set.request.query == true && req.query) {
                    entry.request.query = req.query;
                }
                if (act.set.request.body === true && req.body !== undefined) {
                    entry.request.body = req.body;
                }
                if (act.set.request.headers) {
                    if (act.set.request.headers === true) {
                        entry.request.headers = req.headers;
                    }
                    else if (Array.isArray(act.set.request.headers)) {
                        entry.request.headers = {};
                        for (let headerKey of act.set.request.headers) {
                            if (req.headers[headerKey] !== undefined) {
                                entry.request.headers[headerKey] = req.headers[headerKey];
                            }
                        }
                    }
                }
                if (act.set.request.userData === true) {
                    if (this.config.getUserData === undefined) {
                        DebugLog_1.access.error(`For route ${path}, rule has set.request.userData=true but the getUserData function has not been defined`);
                    }
                    else {
                        try {
                            entry.request.userData = this.config.getUserData(req, res);
                        }
                        catch (e) {
                            DebugLog_1.access.error(`getUserData function threw error: ${e.toString()}`);
                        }
                    }
                }
            }
        }
        this.sendToTransports(entry);
    }
    /**
     * Sends a access log entry to all the transports in a async manner,
     * so they don't wait after each other
     * @param entry
     */
    sendToTransports(entry) {
        for (let transport of this.transports) {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const sent = transport.transport(entry);
                    if (sent instanceof Promise) {
                        yield sent;
                    }
                }
                catch (ignored) { }
            }))().catch();
        }
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