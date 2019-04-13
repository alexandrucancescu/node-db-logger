"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generic_1 = require("../util/Generic");
class RuleValidationError extends Error {
    constructor(rule, key) {
        super(null);
        if (rule !== undefined && rule !== null) {
            this.ruleIdentifier = `with path='${rule._originalPath || rule.path}'`;
        }
        else {
            this.ruleIdentifier = String(rule);
        }
        super.message = `Validation error for rule ${this.ruleIdentifier} , for key ${this.key}`;
        this.rule = rule;
        this.key = key;
    }
    shouldBe(type) {
        const butIs = Generic_1.getProp(this.rule, this.key);
        super.message = `At rule ${this.ruleIdentifier}, key ${this.key} should be a ${type}, but is a ${typeof butIs} with value '${butIs}'`;
        return this;
    }
    invalidRule() {
        super.message = `Invalid rule ${this.ruleIdentifier}. RouteRule should be a object !== null`;
        return this;
    }
    invalidKey() {
        const value = Generic_1.getProp(this.rule, this.key);
        super.message = `At rule ${this.ruleIdentifier}, key ${this.key} has in invalid value=${value}`;
        return this;
    }
    validationError(error) {
        super.message = `At rule ${this.ruleIdentifier}, ${error}`;
        return this;
    }
}
exports.default = RuleValidationError;
//# sourceMappingURL=RuleValidationError.js.map