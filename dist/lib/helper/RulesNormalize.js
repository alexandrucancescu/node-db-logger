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
    let currentRulePriority = 0;
    return rules.filter(rule => {
        if (typeof rule !== "object" || rule === null) {
            return false;
        }
        if (!isPathValid(rule.path)) {
            return false;
        }
        //Save the original path for debugging purposes
        rule._originalPath = rule.path;
        if (typeof rule.path === "string") {
            if (isGlob(rule.path)) {
                rule.path = micromatch_1.makeRe(rule.path);
            }
            else {
                rule.path = Generic_1.cleanUrl(rule.path);
            }
        }
        normalizeConditionals(rule);
        normalizeAct(rule);
        if (typeof rule.priority !== "number" || isNaN(rule.priority)) {
            if (rule.priority !== undefined || (typeof rule.priority === "number" && isNaN(rule.priority))) {
                typeMismatchDebug(rule, "priority", "number", rule.priority);
            }
            currentRulePriority += 0.001;
            rule.priority = currentRulePriority;
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
function normalizeConditionals(rule) {
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
            //Ensures if.requestUnfulfilled is a boolean or deletes it
            if (rule.if.requestUnfulfilled !== undefined) {
                if (typeof rule.if.requestUnfulfilled !== "boolean") {
                    typeMismatchDebug(rule, "if.requestUnfulfilled", "boolean", rule.if.requestUnfulfilled);
                    delete rule.if.requestUnfulfilled;
                }
            }
            //Validates if.contentType rule/rules.
            //Keeps only string entries that have a length>0
            if (rule.if.contentType !== undefined) {
                if (Array.isArray(rule.if.contentType)) {
                    rule.if.contentType = rule.if.contentType.filter(ct => typeof ct === "string" && ct.length > 0);
                    if (rule.if.contentType.length < 1) {
                        //Delete if no rules left after filtering
                        delete rule.if.contentType;
                    }
                }
                else if (typeof rule.if.contentType !== "string") {
                    typeMismatchDebug(rule, "if.contentType", "string || string[]", rule.if.contentType);
                    delete rule.if.contentType;
                }
                else if (rule.if.contentType.length < 1) {
                    delete rule.if.contentType;
                }
            }
            //Validates if.statusCode rule/rules
            //Makes sure to only keep wildcard string or numbers that can represent http status codes
            if (rule.if.statusCode !== undefined) {
                if (Array.isArray(rule.if.statusCode)) {
                    rule.if.statusCode = rule.if.statusCode.filter(sc => {
                        return (typeof sc === "string" && sc.length === 3) ||
                            (typeof sc === "number" && sc > 99 && sc < 600);
                    });
                    if (rule.if.statusCode.length < 1) {
                        delete rule.if.statusCode;
                    }
                }
                else if (typeof rule.if.statusCode === "string") {
                    if (rule.if.statusCode.length !== 3) {
                        DebugLog_1.default.error(`On rule with path '${rule._originalPath}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
                        delete rule.if.statusCode;
                    }
                }
                else if (typeof rule.if.statusCode === "number") {
                    //Delete if not a valid http status code
                    if (rule.if.statusCode < 100 || rule.if.statusCode >= 600) {
                        DebugLog_1.default.error(`On rule with path '${rule._originalPath}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
                        delete rule.if.statusCode;
                    }
                }
                else {
                    typeMismatchDebug(rule, "if.statusCode", "string || number || string[] || number[]", typeof rule.if.statusCode);
                }
            }
            const hasAnyCondition = [
                rule.if.statusCode,
                rule.if.contentType,
                rule.if.contentType,
                rule.if.test
            ].some(c => c !== undefined);
            //If it does not have any condition delete it altogether
            if (!hasAnyCondition) {
                delete rule.if;
            }
        }
    }
}
function normalizeAct(rule) {
    if (rule.do !== undefined || rule.do === null) {
        //Ensure is a valid object or delete
        if (typeof rule.do !== "object") {
            typeMismatchDebug(rule, "set", "object", rule.do);
            delete rule.do;
        }
        else if (Object.keys(rule.do).length < 1) {
            delete rule.do;
        }
        else {
            if (rule.do.skip !== undefined) {
                //Ensure it is a boolean
                rule.do.skip = (rule.do.skip === true);
            }
        }
    }
}
function typeMismatchDebug(rule, property, shouldBe, is) {
    DebugLog_1.default.error(`On rule with path '${rule._originalPath}'. Property '${property}' should be of type ${shouldBe}, instead is a ${typeof is} with value ${is}`);
}
//# sourceMappingURL=RulesNormalize.js.map