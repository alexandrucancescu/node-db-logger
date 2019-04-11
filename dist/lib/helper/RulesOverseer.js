"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generic_1 = require("../util/Generic");
const RulesNormalize_1 = require("./RulesNormalize");
const merge = require("lodash.merge");
class RulesOverseer {
    constructor(rules) {
        this.rules = RulesNormalize_1.default(rules);
    }
    computeRouteAct(req, res) {
        const path = Generic_1.cleanUrl(req.originalUrl || req.url);
        console.log("URL", path, "code", res.statusCode, "mime", res.get("content-type"));
        const matchedRules = this.getRulesMatched(path, req, res);
        console.log(matchedRules.map((r) => r._originalPath));
        // console.log(matchedRules);
        const mergedAct = merge(...matchedRules.map(r => r.do));
        console.log(mergedAct);
    }
    getRulesMatched(path, req, res) {
        return this.rules.filter(rule => {
            if (!pathMatches(path, rule)) {
                return false;
            }
            if (rule.if) {
                return conditionsSatisfied(res, rule);
            }
            else {
                //If there are no conditions to be satisfied return true
                return true;
            }
        });
    }
}
exports.default = RulesOverseer;
/**
 * Multiple conditions in a .if property are treated as 'or', so true is returned
 * when any of them are satisfied
 */
function conditionsSatisfied(res, rule) {
    const conditions = rule.if;
    if (res.headersSent) {
        if (conditions.statusCode) {
            if (statusCodeRuleMatches(res.statusCode, conditions.statusCode)) {
                return true;
            }
        }
        if (conditions.contentType) {
        }
    }
    if (conditions.requestUnfulfilled && !res.headersSent) {
        return true;
    }
    if (conditions.test) {
        return conditions.test() === true;
    }
    return false;
}
/**
 * @return true if the status code matches the StatusCodeRule
 */
function statusCodeRuleMatches(code, codeRule) {
    if (code === undefined)
        return false;
    if (Array.isArray(codeRule)) {
        return codeRule.some(statusCodeAtomMatches.bind(null, code)); //If one of the rules matches
    }
    return statusCodeAtomMatches(code, codeRule);
}
/**
 * Tests a single atom of a StatusCodeRule
 */
function statusCodeAtomMatches(code, ruleAtom) {
    if (typeof ruleAtom === "number") {
        return ruleAtom === code;
    }
    else if (typeof ruleAtom === "string") {
        return Generic_1.wildcardNumberMatch(code, ruleAtom);
    }
    return false;
}
function pathMatches(path, rule) {
    if (typeof rule.path === "string") {
        return rule.path === path;
    }
    else if (rule.path instanceof RegExp) {
        return rule.path.test(path);
    }
    return false;
}
/**
 * Compares two RouteRules based on their priority
 * Utility function for array sorting
 */
function priorityCompare(a, b) {
    return a.priority - b.priority;
}
//# sourceMappingURL=RulesOverseer.js.map