"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DebugLog_1 = require("../util/DebugLog");
const Generic_1 = require("../util/Generic");
const isGlob = require("is-glob");
const micromatch_1 = require("micromatch");
/**
 * Removes rules with invalid paths
 * Cleans urls
 * Converts glob pattern paths to regex paths
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
        if (!isPathValid(rule.path))
            return false;
        if (typeof rule.path === "string") {
            if (isGlob(rule.path)) {
                rule.path = micromatch_1.makeRe(rule.path);
            }
            else {
                rule.path = Generic_1.cleanUrl(rule.path);
            }
        }
        normalizeRuleIfProperty(rule);
        normalizeRuleSetProperty(rule);
        if (rule.skip !== undefined) {
            //Ensure it is a boolean
            rule.skip = (rule.skip === true);
        }
        if (rule.priority !== undefined) {
            if (typeof rule.priority !== "number") {
                typeMismatchDebug(rule, "priority", "number", typeof rule.priority);
                delete rule.priority;
            }
        }
        return true;
    });
}
exports.default = normalizeRules;
function isPathValid(path) {
    if (typeof path === "string") {
        if (path.length < 1) {
            DebugLog_1.default.error(`Path ${path} is invalid`);
            return false;
        }
    }
    else if (!(path instanceof RegExp)) {
        DebugLog_1.default.error(`Path ${path} should be either string or RegExp`);
        return false;
    }
    return true;
}
//Wrap function to prevent error throw and to ensure the type returned is boolean
function wrapBooleanFunction(func) {
    return function (...any) {
        try {
            return func(...any) === true;
        }
        catch (e) {
            DebugLog_1.default.error("RouterRule if.test function threw error:", e);
            return false;
        }
    };
}
function normalizeRuleIfProperty(rule) {
    if (rule.if !== undefined) {
        //Ensure is a valid object or delete
        if (typeof rule.if !== "object" || rule.if === null) {
            typeMismatchDebug(rule, "if", "object", rule.if);
            delete rule.if;
        }
        else {
            //Ensure if.test is a function and if it is wrap it in a safe call
            if (rule.if.test !== undefined) {
                if (typeof rule.if.test !== "function") {
                    typeMismatchDebug(rule, "if.test", "function", rule.if.test);
                    delete rule.if.test;
                }
                else {
                    //Wrap test function to prevent error throw
                    rule.if.test = wrapBooleanFunction(rule.if.test);
                }
            }
            //Validates if.contentType rule/rules.
            //Keeps only string entries that have a length>0
            if (rule.if.contentType !== undefined) {
                if (Array.isArray(rule.if.contentType)) {
                    rule.if.contentType = rule.if.contentType.filter(ct => typeof ct === "string" && ct.length > 0);
                }
                else if (typeof rule.if.contentType !== "string") {
                    typeMismatchDebug(rule, "if.contentType", "string || string[]", rule.if.contentType);
                    delete rule.if.contentType;
                }
            }
            //Validates if.statusCode rule/rules
            //Makes sure to only keep wildcard string or numbers that can represent http status codes
            if (rule.if.statusCode !== undefined) {
                if (rule.if.statusCode instanceof Array) {
                    rule.if.statusCode = rule.if.statusCode.filter(sc => {
                        return (typeof sc === "string" && sc.length === 3) ||
                            (typeof sc === "number" && sc > 99 && sc < 600);
                    });
                }
                else if (typeof rule.if.statusCode === "string") {
                    if (rule.if.statusCode.length !== 3) {
                        DebugLog_1.default.error(`On rule with path '${rule.path}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
                        delete rule.if.statusCode;
                    }
                }
                else if (typeof rule.if.statusCode === "number") {
                    if (rule.if.statusCode < 100 || rule.if.statusCode >= 600) {
                        DebugLog_1.default.error(`On rule with path '${rule.path}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
                        delete rule.if.statusCode;
                    }
                }
                else {
                    typeMismatchDebug(rule, "if.statusCode", "string || number || string[] || number[]", typeof rule.if.statusCode);
                }
            }
        }
    }
}
function normalizeRuleSetProperty(rule) {
    if (rule.set !== undefined || rule.set === null) {
        //Ensure is a valid object or deletes
        if (typeof rule.set !== "object") {
            typeMismatchDebug(rule, "set", "object", rule.set);
            delete rule.set;
        }
        else if (Object.keys(rule.set).length < 1) {
            delete rule.set;
        }
    }
}
function typeMismatchDebug(rule, property, shouldBe, is) {
    DebugLog_1.default.error(`On rule with path '${rule.path}'. Property '${property}' should be of type ${shouldBe}, instead is ${typeof is}`);
}
//# sourceMappingURL=RulesNormalize.js.map