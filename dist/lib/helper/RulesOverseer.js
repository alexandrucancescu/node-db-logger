"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RulesNormalize_1 = require("./RulesNormalize");
class RulesOverseer {
    constructor(rules) {
        this.rules = RulesNormalize_1.default(rules);
    }
}
exports.default = RulesOverseer;
//# sourceMappingURL=RulesOverseer.js.map