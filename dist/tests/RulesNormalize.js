"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const RulesNormalize_1 = require("../lib/helper/RulesNormalize");
const Logger_1 = require("../lib/Logger");
Logger_1.default.configuration.debug = false;
mocha_1.describe("Rules normalization", () => {
    mocha_1.describe("Paths", () => {
        mocha_1.it("should remove only rules with invalid paths", removesInvalidPaths);
        mocha_1.it("should clean paths URLs", cleansPathsUrls);
    });
    mocha_1.describe("Skip property", () => {
        mocha_1.it("should handle property skip not boolean", handlesSkipNotBoolean);
    });
    mocha_1.describe("Priority property", () => {
        mocha_1.it("should remove priority property if wrong type", handlesPriorityPropertyWrongType);
    });
    mocha_1.describe("Conditional properties", () => {
        mocha_1.it("should remove invalid .if properties", removesInvalidIfProperties);
        mocha_1.describe(".statusCode property", () => {
            mocha_1.it("should remove invalid status codes", removesInvalidStatusCodes);
        });
        mocha_1.describe(".contentType property", () => {
            mocha_1.it("should remove invalid content types values", removesInvalidContentTypeValues);
        });
        mocha_1.describe(".test function", () => {
            mocha_1.it("should remove invalid .test functions", removesInvalidTestFunctions);
            mocha_1.it("should wrap .test function into a safe call that only returns boolean", wrapsTestFunctions);
        });
    });
});
function removesInvalidIfProperties() {
    const rules = getMockRules("if", [
        { statusCode: 400 }, true, 45, ""
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0]).to.have.ownProperty("if");
    chai_1.expect(normalized[1]).to.not.have.ownProperty("if");
    chai_1.expect(normalized[2]).to.not.have.ownProperty("if");
    chai_1.expect(normalized[3]).to.not.have.ownProperty("if");
}
function wrapsTestFunctions() {
    const rules = getMockRules("if", [
        {
            test() {
                return "Rebel";
            }
        },
        {
            test() {
                throw new Error();
            }
        }
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].if.test).to.not.throw;
    chai_1.expect(normalized[0].if.test()).to.equal(false);
    chai_1.expect(normalized[1].if.test).to.not.throw;
    chai_1.expect(normalized[1].if.test()).to.equal(false);
}
function removesInvalidTestFunctions() {
    const rules = getMockRules("if", [
        { test: null },
        { test: new Date() },
        { test: () => { } },
        { test: "do{}while()" },
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].if).to.not.have.ownProperty("test");
    chai_1.expect(normalized[1].if).to.not.have.ownProperty("test");
    chai_1.expect(normalized[3].if).to.not.have.ownProperty("test");
    chai_1.expect(normalized[2].if).to.have.ownProperty("test");
}
function removesInvalidContentTypeValues() {
    const rules = getMockRules("if", [
        { contentType: 30 },
        { contentType: { x: 1 } },
        { contentType: "application/json" },
        { contentType: [""] },
        { contentType: [30, "*/*", "media/*", "", null, new Date()] }
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].if).to.not.have.ownProperty("contentType");
    chai_1.expect(normalized[1].if).to.not.have.ownProperty("contentType");
    chai_1.expect(normalized[2].if).to.have.ownProperty("contentType");
    chai_1.expect(normalized[3].if).to.have.ownProperty("contentType");
    chai_1.expect(normalized[4].if).to.have.ownProperty("contentType");
    chai_1.expect(normalized[2].if.contentType).to.equal("application/json");
    chai_1.expect(normalized[3].if.contentType).to.have.length(0);
    chai_1.expect(normalized[4].if.contentType).to.have.length(2);
    chai_1.expect(normalized[4].if.contentType).to.deep.equal(["*/*", "media/*"]);
}
function removesInvalidStatusCodes() {
    const rules = getMockRules("if", [
        { statusCode: 30 }, { statusCode: "4500" }, { statusCode: 300 }, { statusCode: ["4**"] },
        { statusCode: [30, 500, "4**", "5*", null, new Date()] }
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].if).to.not.have.ownProperty("statusCode");
    chai_1.expect(normalized[1].if).to.not.have.ownProperty("statusCode");
    chai_1.expect(normalized[2].if).to.have.ownProperty("statusCode");
    chai_1.expect(normalized[3].if).to.have.ownProperty("statusCode");
    chai_1.expect(normalized[4].if).to.have.ownProperty("statusCode");
    chai_1.expect(normalized[2].if.statusCode).to.equal(300);
    chai_1.expect(normalized[3].if.statusCode).to.deep.equal(["4**"]);
    chai_1.expect(normalized[4].if.statusCode).to.have.length(2);
    chai_1.expect(normalized[4].if.statusCode).to.deep.equal([500, "4**"]);
}
function handlesPriorityPropertyWrongType() {
    const rules = getMockRules("priority", [null, "34", {}, 55]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0]).to.not.have.ownProperty("priority");
    chai_1.expect(normalized[1]).to.not.have.ownProperty("priority");
    chai_1.expect(normalized[2]).to.not.have.ownProperty("priority");
    chai_1.expect(normalized[3]).to.have.ownProperty("priority");
    chai_1.expect(normalized[3].priority).to.equal(55);
}
function cleansPathsUrls() {
    const rules = getMockRules("path", ["/url/", "/url?x=21&y=33", "///"]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].path).to.equal("/url");
    chai_1.expect(normalized[1].path).to.equal("/url");
    //URL cleaning still expects valid paths. It will only remove trailing slashes
    chai_1.expect(normalized[2].path).to.equal("//");
}
function handlesSkipNotBoolean() {
    // @ts-ignore
    const rules = getMockRules("skip", ["false", "true", null, true]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(4);
    chai_1.expect(normalized[0].skip).to.be.false;
    chai_1.expect(normalized[1].skip).to.be.false;
    chai_1.expect(normalized[2].skip).to.be.false;
    chai_1.expect(normalized[3].skip).to.be.true;
}
function removesInvalidPaths() {
    const rules = [{ path: null }, { path: 44 }, { path: "" }, { path: /\/.*/g }];
    // @ts-ignore
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(1);
    chai_1.expect(normalized[0]).to.haveOwnProperty("path");
    chai_1.expect(normalized[0].path).to.be.instanceOf(RegExp);
}
function getMockRules(withKey, values) {
    return values.map(v => {
        let rule = { path: "/" };
        rule[withKey] = v;
        return rule;
    });
}
//# sourceMappingURL=RulesNormalize.js.map