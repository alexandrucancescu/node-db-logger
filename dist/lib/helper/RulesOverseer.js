"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RulesNormalize_1 = require("./RulesNormalize");
class RulesOverseer {
    constructor(rules) {
        this.rules = RulesNormalize_1.default(rules);
    }
    computeRouteAct(path, req, res) {
        const rules = this.getRulesForPath(path);
    }
    getRulesForPath(path) {
        return this.rules.filter(rule => {
            if (typeof rule.path === "string") {
                return rule.path === path;
            }
            else if (rule.path instanceof RegExp) {
                return rule.path.test(path);
            }
            return false;
        });
    }
}
exports.default = RulesOverseer;
//# sourceMappingURL=RulesOverseer.js.map