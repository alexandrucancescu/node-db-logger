"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DebugLog_1 = require("../../util/DebugLog");
const Generic_1 = require("../../util/Generic");
const isGlob = require("is-glob");
const micromatch_1 = require("micromatch");
const RuleValidationError_1 = require("./RuleValidationError");
/**
 * Ensures rules have a valid path and .do action
 * Cleans urls
 * Converts glob pattern paths to regex paths
 * Removes invalid properties from rules
 *
 *
 * @param rules = rules passed to the RulesOverseer constructor
 * @returns the valid rules
 */
function normalizeRules(rules, trimSlash = true) {
    if (!Array.isArray(rules)) {
        return [];
    }
    let currentRulePriority = 0;
    return rules.filter(rule => {
        if (typeof rule !== "object" || rule === null) {
            throw new RuleValidationError_1.default(rule).invalidRule();
        }
        normalizePath(rule, trimSlash);
        normalizeConditionals(rule);
        normalizeAct(rule);
        //Rule has no worth as it does not describe an action to do
        if (rule.do === undefined) {
            return false;
        }
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
function normalizePath(rule, trimSlash = true) {
    //Save the original path for debugging purposes
    rule._originalPath = rule.path;
    if (typeof rule.path === "string") {
        if (rule.path.length < 1) {
            throw new RuleValidationError_1.default(rule, "path").invalidKey();
        }
        if (isGlob(rule.path)) {
            rule.path = micromatch_1.makeRe(rule.path);
        }
        else {
            rule.path = Generic_1.cleanUrl(rule.path, trimSlash);
        }
    }
    else if (!(rule.path instanceof RegExp)) {
        throw new RuleValidationError_1.default(rule, "path").shouldBe("string/RegExp");
    }
}
function normalizeConditionals(rule) {
    if (ensureObject(rule, "if")) {
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
                    arrayInvalidItemsDebug(rule, "rule.if.contentType");
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
                    arrayInvalidItemsDebug(rule, "rule.if.statusCode");
                    delete rule.if.statusCode;
                }
            }
            else if (typeof rule.if.statusCode === "string") {
                if (rule.if.statusCode.length !== 3) {
                    DebugLog_1.access.error(`On rule with path '${rule._originalPath}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
                    delete rule.if.statusCode;
                }
            }
            else if (typeof rule.if.statusCode === "number") {
                //Delete if not a valid http status code
                if (rule.if.statusCode < 100 || rule.if.statusCode >= 600) {
                    DebugLog_1.access.error(`On rule with path '${rule._originalPath}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
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
            rule.if.test,
            rule.if.requestUnfulfilled
        ].some(c => c !== undefined);
        //If it does not have any condition delete it altogether
        if (!hasAnyCondition) {
            delete rule.if;
        }
    }
}
function normalizeAct(rule) {
    if (typeof rule.do === "object" && rule.do !== null) {
        if (rule.do.skip !== undefined && typeof rule.do.skip !== "boolean") {
            throw new RuleValidationError_1.default(rule, "do.skip").shouldBe("boolean");
        }
        if (ensureObject(rule, "do.set")) {
            const set = rule.do.set;
            if (ensureObject(rule, "do.set.request")) {
                ensureBoolean(rule, "do.set.request.userData");
                ensureBoolean(rule, "do.set.request.query");
                ensureBoolean(rule, "do.set.request.body");
                if (set.request.headers !== undefined) {
                    if (Array.isArray(set.request.headers)) {
                        set.request.headers = set.request.headers.filter(h => typeof h === "string" && h.length > 0);
                        if (set.request.headers.length < 1) {
                            arrayInvalidItemsDebug(rule, "do.set.request.headers");
                            delete set.request.headers;
                        }
                    }
                    else if (typeof set.request.headers !== "boolean") {
                        typeMismatchDebug(rule, "rule.do.set.request.headers", "array", set.request.headers);
                        delete set.request.headers;
                    }
                }
            }
            if (ensureObject(rule, "do.set.response")) {
                ensureBoolean(rule, "do.set.response.body");
                if (set.response.headers !== undefined) {
                    if (Array.isArray(set.response.headers)) {
                        set.response.headers = set.response.headers.filter(h => typeof h === "string" && h.length > 0);
                        if (set.response.headers.length < 1) {
                            arrayInvalidItemsDebug(rule, "do.set.response.headers");
                            delete set.response.headers;
                        }
                    }
                    else if (typeof set.response.headers !== "boolean") {
                        typeMismatchDebug(rule, "rule.do.set.response.headers", "array", set.response.headers);
                        delete set.response.headers;
                    }
                }
            }
        }
        if (rule.do.set !== undefined) {
            if (rule.do.skip === true) {
                throw new RuleValidationError_1.default(rule).validationError(", for key .do, cannot set both .skip and .set properties");
            }
            else {
                rule.do.skip = false;
            }
        }
        const hasAnyAction = [
            rule.do.skip,
            rule.do.set
        ].some(a => a !== undefined);
        if (!hasAnyAction) {
            delete rule.do;
        }
    }
    else {
        throw new RuleValidationError_1.default(rule, "do").shouldBe("object");
    }
}
/**
 * @summary Checks if key of rule represents a boolean.
 * 			If not, the property gets deleted from the rule
 * @param rule The rule whose key is checked
 * @param key Can represent a nested key, like 'do.set.request.headers'
 */
function ensureBoolean(rule, key) {
    const val = Generic_1.getProp(rule, key);
    if (val !== undefined && typeof val !== "boolean") {
        typeMismatchDebug(rule, key, "boolean", val);
        Generic_1.deleteProp(rule, key);
    }
}
/**
 * @summary Checks if key of rule represents an object that is not null.
 * 			If not, the property gets deleted from the rule
 * @param rule The rule whose key is checked
 * @param key Can represent a nested key, like 'do.set.request.headers'
 * @return true if the value of key of is an object
 */
function ensureObject(rule, key) {
    const val = Generic_1.getProp(rule, key);
    if (typeof val !== "object" || val === null) {
        //If undefined no need to log it or delete it
        if (val !== undefined) {
            typeMismatchDebug(rule, key, "object", val);
            Generic_1.deleteProp(rule, key);
        }
        return false;
    }
    else {
        return true;
    }
}
//Wrap function to prevent error throw and to ensure the type returned is boolean
function wrapBooleanFunction(func) {
    return function (...any) {
        try {
            return func(...any) === true;
        }
        catch (e) {
            DebugLog_1.access.error("RouterRule if.test function threw error:", e);
            return false;
        }
    };
}
function typeMismatchDebug(rule, property, shouldBe, is) {
    DebugLog_1.access.error(`On rule with .path='${rule._originalPath}'. Property .${property} should be of type ${shouldBe}, instead is a ${typeof is} with value='${is}'`);
}
function arrayInvalidItemsDebug(rule, property) {
    DebugLog_1.access.error(`On rule with .path='${rule._originalPath}'. Property .${property} has no valid items`);
}
//# sourceMappingURL=RulesNormalize.js.map