"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const RulesNormalize_1 = require("../lib/helper/RulesNormalize");
const Logger_1 = require("../lib/Logger");
Logger_1.default.configuration.debug = false;
mocha_1.describe("Rules normalization", () => {
    mocha_1.it("should remove rules that are null or not objects", removesInvalidRules);
    mocha_1.describe("Paths", () => {
        mocha_1.it("should remove only rules with invalid paths", removesInvalidPaths);
        mocha_1.it("should clean paths URLs", cleansPathsUrls);
        mocha_1.it("should convert glob pattern paths to regex", convertsGlobPathsToRegex);
        mocha_1.it("should correctly resolve glob paths", correctlyResolvesGlobPaths);
    });
    mocha_1.describe("Skip property", () => {
        mocha_1.it("should handle property skip not boolean", handlesSkipNotBoolean);
    });
    mocha_1.describe("Priority property", () => {
        mocha_1.it("should add property priority if missing, in correlation with the order defined", addsMissingPriority);
    });
    mocha_1.describe("Conditional properties", () => {
        mocha_1.it("should delete invalid .if properties", deletesInvalidIfProperties);
        mocha_1.it("should delete .if properties with invalid conditions or empty object", deletesEmptyIfProperties);
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
function deletesInvalidIfProperties() {
    const rules = getMockRules("if", [
        { statusCode: 400 }, true, 45, ""
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0]).to.have.ownProperty("if");
    chai_1.expect(normalized[1]).to.not.have.ownProperty("if");
    chai_1.expect(normalized[2]).to.not.have.ownProperty("if");
    chai_1.expect(normalized[3]).to.not.have.ownProperty("if");
}
function deletesEmptyIfProperties() {
    const rules = getMockRules("if", [
        { statusCode: [] }, { statusCode: ["1", null] },
        { statusCode: 0, test: true, contentType: "" }, {}, null
    ]);
    const normalized = RulesNormalize_1.default(rules);
    normalized.forEach((rule, index) => {
        chai_1.expect(rule, `Rule at [${index}]`).to.not.have.property("if");
    });
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
    const rules = getMockIfRules("test", [
        null,
        new Date(),
        () => { },
        "do{}while()",
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].if).to.not.have.ownProperty("test");
    chai_1.expect(normalized[1].if).to.not.have.ownProperty("test");
    chai_1.expect(normalized[3].if).to.not.have.ownProperty("test");
    chai_1.expect(normalized[2].if).to.have.ownProperty("test");
}
function removesInvalidContentTypeValues() {
    const rules = getMockIfRules("contentType", [
        30,
        { x: 1 },
        "application/json",
        [""],
        [30, "*/*", "media/*", "", null, new Date()] //[1] and [2] remain
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].if).to.not.have.ownProperty("contentType");
    chai_1.expect(normalized[1].if).to.not.have.ownProperty("contentType");
    chai_1.expect(normalized[2].if).to.have.ownProperty("contentType");
    chai_1.expect(normalized[3].if).to.not.have.ownProperty("contentType");
    chai_1.expect(normalized[4].if).to.have.ownProperty("contentType");
    chai_1.expect(normalized[2].if.contentType).to.equal("application/json");
    chai_1.expect(normalized[4].if.contentType).to.have.length(2);
    chai_1.expect(normalized[4].if.contentType).to.deep.equal(["*/*", "media/*"]);
}
function removesInvalidStatusCodes() {
    const rules = getMockIfRules("statusCode", [
        30, 4500, 300, ["4**"], [30, 500, "4**", "5*", null, new Date()]
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
function addsMissingPriority() {
    const rules = [];
    for (let i = 0; i < 20; i++) {
        rules.push({ path: "/", do: {} });
    }
    const normalized = RulesNormalize_1.default(rules);
    for (let i = 0; i < normalized.length; i++) {
        const rule = normalized[i];
        chai_1.expect(rule).to.haveOwnProperty("priority");
        chai_1.expect(rule.priority).to.be.a("number");
        if (i === 0) {
            chai_1.expect(rule.priority).to.be.greaterThan(0);
            continue;
        }
        else {
            chai_1.expect(rule.priority).to.be.greaterThan(normalized[i - 1].priority);
        }
        if (i === normalized.length - 1) { //last one
            chai_1.expect(rule.priority).to.be.lessThan(1);
        }
    }
}
function cleansPathsUrls() {
    const rules = getMockRules("path", ["/url/", "/url?x=21&y=33", "///"]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].path).to.equal("/url");
    chai_1.expect(normalized[1].path).to.equal("/url");
    //URL cleaning still expects valid paths. It will only remove trailing slashes
    chai_1.expect(normalized[2].path).to.equal("//");
}
function convertsGlobPathsToRegex() {
    const rules = [
        { path: "/users/index", do: {} },
        { path: "/users/**", do: {} },
        { path: "", do: {} },
        { path: "/**/index.html", do: {} } //Is converted to regex
    ];
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(3);
    chai_1.expect(normalized[0].path).to.be.a("string");
    chai_1.expect(normalized[1].path).to.be.instanceOf(RegExp);
    chai_1.expect(normalized[2].path).to.be.instanceOf(RegExp);
}
function correctlyResolvesGlobPaths() {
    const rules = [
        { path: "/users/**", do: {} },
        { path: "/**/index.html", do: {} } //Is converted to regex
    ];
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].path).to.be.instanceOf(RegExp);
    const first = normalized[0].path;
    chai_1.expect(first.test("/")).to.be.false;
    chai_1.expect(first.test("/users")).to.be.false;
    chai_1.expect(first.test("")).to.be.false;
    chai_1.expect(first.test("/users/available/today")).to.be.true;
    const second = normalized[1].path;
    chai_1.expect(second.test("/")).to.be.false;
    chai_1.expect(second.test("")).to.be.false;
    chai_1.expect(second.test("/l1/l2/l3/l4")).to.be.false;
    chai_1.expect(second.test("/index.html")).to.be.true;
    chai_1.expect(second.test("/l1/l2/l3/l4/index.html")).to.be.true;
    chai_1.expect(second.test("/l1/index.html")).to.be.true;
}
function handlesSkipNotBoolean() {
    // @ts-ignore
    const rules = getMockDoRules("skip", ["false", "true", null, true]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(4);
    chai_1.expect(normalized[0].do.skip).to.be.false;
    chai_1.expect(normalized[1].do.skip).to.be.false;
    chai_1.expect(normalized[2].do.skip).to.be.false;
    chai_1.expect(normalized[3].do.skip).to.be.true;
}
function removesInvalidPaths() {
    const rules = getMockRules("path", [
        45, true, null, undefined, "/users", /\/.*/,
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(2);
    chai_1.expect(normalized[0]).to.haveOwnProperty("path");
    chai_1.expect(normalized[1]).to.haveOwnProperty("path");
    chai_1.expect(normalized[0].path).to.be.a("string");
    chai_1.expect(normalized[1].path).to.be.instanceOf(RegExp);
}
function removesInvalidRules() {
    const rules = [
        null, 4450, true, "rule", { path: "/", do: {} }
    ];
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(1);
    chai_1.expect(normalized[0]).to.be.a.instanceOf(Object);
}
function getMockIfRules(withIfKey, values) {
    return values.map(v => {
        let mock = {
            path: "/",
            if: {
                requestUnfulfilled: true,
                statusCode: "5**",
            },
            do: { skip: false }
        };
        mock.if[withIfKey] = v;
        return mock;
    });
}
function getMockDoRules(doKey, values) {
    return values.map(v => {
        let rule = { path: "/", do: {} };
        rule.do[doKey] = v;
        return rule;
    });
}
function getMockRules(withKey, values) {
    return values.map(v => {
        let rule = { path: "/", do: {} };
        rule[withKey] = v;
        return rule;
    });
}
//# sourceMappingURL=RulesNormalize.js.map