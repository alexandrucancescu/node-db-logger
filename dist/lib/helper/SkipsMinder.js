"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generic_1 = require("../util/Generic");
class SkipsMinder {
    constructor(skipRules) {
        this.skipRules = skipRules;
        this.cleanRulesUrls();
    }
    shouldSkip(path, res) {
        if (!Array.isArray(this.skipRules) || this.skipRules.length < 1) {
            return { stdout: false, main: false };
        }
        const matchingRules = this.getMatchingRulesFor(path);
        if (matchingRules.length < 1)
            return { stdout: false, main: false };
        let skipStdout = false;
        let shouldSkip = false;
        for (let rule of matchingRules) {
            let ruleBroken = false;
            const ifs = rule.if;
            if (!ifs) {
                shouldSkip = true;
            }
            else {
            }
            if (shouldSkip === true && rule.skipStout) {
                skipStdout = true;
            }
            //No reason to continue. A rule was broken and stdout is skipped too
            //Else we continue. Maybe there is a rule to skip stdout also
            if (shouldSkip && skipStdout) {
                return { stdout: true, main: true };
            }
        }
    }
    static statusCodeMatch(code, rule) {
        if (typeof rule === "number") {
            return code === rule;
        }
        else if (typeof rule === "string") {
            return Generic_1.wildcardNumberMatch(code, rule);
        }
        else if (Array.isArray(rule) && rule.length > 0) {
            for (let currentRule of rule) {
                if (typeof currentRule === "number" && currentRule === code) {
                    return true;
                }
                else if (typeof currentRule === "string" && Generic_1.wildcardNumberMatch(code, currentRule)) {
                    return true;
                }
            }
        }
        return false;
    }
    getMatchingRulesFor(path) {
        return this.skipRules.filter(rule => {
            if (typeof rule.path === "string") {
                return rule.path === path;
            }
            else if (rule.path instanceof RegExp) {
                return rule.path.test(path);
            }
            return false;
        });
    }
    cleanRulesUrls() {
        if (Array.isArray(this.skipRules)) {
            this.skipRules.forEach(rule => {
                if (typeof rule.path === "string") {
                    rule.path = Generic_1.cleanUrl(rule.path);
                }
            });
        }
    }
}
exports.default = SkipsMinder;
//# sourceMappingURL=SkipsMinder.js.map