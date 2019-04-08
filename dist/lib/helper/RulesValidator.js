"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DebugLog_1 = require("../util/DebugLog");
const Generic_1 = require("../util/Generic");
/**
 * Removes rules with invalid paths
 * Removes invalid properties from rules
 *
 *
 * @param rules = rules passed to the constructor
 * @returns the valid rules
 */
function normalizeRules(rules) {
    if (!Array.isArray(rules)) {
        return [];
    }
    return rules.filter(rule => {
        if (typeof rule.path === "string") {
            if (rule.path.length < 1) {
                DebugLog_1.default.error(`Rule ${rule} has an invalid path '${rule.path}'`);
                return false;
            }
            //Clean URL in the process if the string is a valid path
            rule.path = Generic_1.cleanUrl(rule.path);
        }
        else if (!(rule.path instanceof RegExp)) {
            DebugLog_1.default.error(`Rule ${rule} path should be either string or RegExp`);
            return false;
        }
        if (rule.if !== undefined) {
            //Ensure is a valid object or delete
            if (typeof rule.if !== "object" || rule.if === null) {
                DebugLog_1.default.error(`Rule ${rule}, property if should be an object, instead is ${typeof rule.if} `);
                delete rule.if;
            }
            else {
                if (rule.if.test !== undefined && typeof rule.if.test !== "function") {
                    DebugLog_1.default.error(`Rule ${rule} property if.test should be a function, instead is ${typeof rule.if.test}`);
                    delete rule.if.test;
                }
                if (rule.if.contentType !== undefined) {
                    if (Array.isArray(rule.if.contentType)) {
                        rule.if.contentType = rule.if.contentType.filter(ct => typeof ct === "string");
                    }
                    else if (typeof rule.if.contentType !== "string") {
                        DebugLog_1.default.error(`Rule ${rule} property if.contentType should be a string or array of strings, instead is ${typeof rule.if.contentType}`);
                        delete rule.if.contentType;
                    }
                }
                if (rule.if.statusCode !== undefined) {
                    if (Array.isArray(rule.if.statusCode)) {
                        // rule.if.statusCode.filter(ct=>
                        // 	typeof ct==="string" || typeof ct==="number"
                        // );
                    }
                }
            }
        }
        if (rule.set !== undefined || rule.set === null) {
            //Ensure is a valid object or delete
            if (typeof rule.set !== "object") {
                DebugLog_1.default.error(`Rule ${rule}, property set should be an object, instead is ${typeof rule.set} `);
                delete rule.set;
            }
            else {
            }
        }
        if (rule.skip !== undefined) {
            //Ensure it is a boolean
            rule.skip = (rule.skip === true);
        }
        return true;
    });
}
exports.default = normalizeRules;
//# sourceMappingURL=RulesValidator.js.map