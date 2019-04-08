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
const AccessLog_1 = require("../model/AccessLog");
const onRequestFinished = require("on-finished");
const Generic_1 = require("../util/Generic");
const SkipsMinder_1 = require("../helper/SkipsMinder");
class AccessLogger {
    constructor(instanceId, config) {
        this.instanceId = instanceId;
        this.config = config;
        this.skipMinder = new SkipsMinder_1.default(config.skipRules);
    }
    middleware() {
        return this.requestHandler.bind(this);
    }
    requestHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const start_ms = Generic_1.getProcessTimeMs();
            onRequestFinished(req, (error) => {
                const end_ms = Generic_1.getProcessTimeMs();
                const logEntry = new AccessLog_1.default();
                logEntry.method = req.method.toUpperCase();
                logEntry.time = new Date();
                logEntry.responseTime = Math.floor(end_ms - start_ms);
                logEntry.instance = this.instanceId;
                logEntry.path = Generic_1.cleanUrl(req.baseUrl);
                console.log(res.statusCode, res.get("content-type"));
            });
            next();
        });
    }
}
exports.default = AccessLogger;
//# sourceMappingURL=AccessLogger.js.map