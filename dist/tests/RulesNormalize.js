"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const RulesNormalize_1 = require("../lib/helper/RulesNormalize");
const RuleValidationError_1 = require("../lib/helper/RuleValidationError");
const Logger_1 = require("../lib/Logger");
Logger_1.default.configuration.debug = false;
mocha_1.describe("Rules normalization", () => {
    mocha_1.it("should throw for invalid rules", throwsForInvalidRules);
    mocha_1.describe("Paths", () => {
        mocha_1.it("should throw for rules with invalid paths", throwsForInvalidPaths);
        mocha_1.it("should clean paths URLs", cleansPathsUrls);
        mocha_1.it("should convert glob pattern paths to regex", convertsGlobPathsToRegex);
        mocha_1.it("should correctly resolve glob paths", correctlyResolvesGlobPaths);
    });
    mocha_1.describe(".priority property", () => {
        mocha_1.it("should add property priority if missing, in correlation with the order defined", addsMissingPriority);
    });
    mocha_1.describe(".if conditional properties", () => {
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
    mocha_1.describe(".do act property", () => {
        mocha_1.it("should throw error for rules with invalid .do properties", throwsForInvalidDoProps);
        mocha_1.describe(".skip property", () => {
            mocha_1.it("should throw if .skip is not a boolean", throwsWhenSkipNotBoolean);
        });
        mocha_1.describe(".set property", () => {
            mocha_1.describe(".request property", () => {
                mocha_1.describe(".headers property", () => {
                    mocha_1.it("should remove invalid request headers from the array", removesInvalidHeadersOf.bind(null, "request"));
                    mocha_1.it("should only allow array/boolean for header property", onlyAllowsArrayOrBooleanForHeadersOf.bind(null, "request"));
                });
                mocha_1.describe("other boolean properties", () => {
                    mocha_1.it("should only allow booleans for properties .query .userData .body", onlyAllowsBooleanForRequestProperties);
                });
            });
            mocha_1.describe(".response property", () => {
                mocha_1.describe(".headers property", () => {
                    mocha_1.it("should remove invalid response headers from the array", removesInvalidHeadersOf.bind(null, "response"));
                    mocha_1.it("should only allow array/boolean for header property", onlyAllowsArrayOrBooleanForHeadersOf.bind(null, "request"));
                });
                mocha_1.describe("other boolean properties", () => {
                    mocha_1.it("should only allow booleans for properties .query .userData .body", onlyAllowsBooleanForResponseProperties);
                });
            });
        });
    });
});
function onlyAllowsBooleanForResponseProperties() {
    const rules = getMockDoRules("set", [
        {
            response: {
                body: null,
            }
        },
        {
            response: {
                body: true,
            }
        }
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].do.set.response).to.not.haveOwnProperty("body");
    chai_1.expect(normalized[1].do.set.response).to.haveOwnProperty("body");
}
function onlyAllowsBooleanForRequestProperties() {
    const rules = getMockDoRules("set", [
        {
            request: {
                body: null,
                userData: { x: 1 },
                query: 9999,
            }
        },
        {
            request: {
                body: true,
                userData: true,
                query: false,
            }
        }
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].do.set.request).to.not.haveOwnProperty("body");
    chai_1.expect(normalized[0].do.set.request).to.not.haveOwnProperty("userData");
    chai_1.expect(normalized[0].do.set.request).to.not.haveOwnProperty("query");
    chai_1.expect(normalized[1].do.set.request).to.haveOwnProperty("body");
    chai_1.expect(normalized[1].do.set.request).to.haveOwnProperty("userData");
    chai_1.expect(normalized[1].do.set.request).to.haveOwnProperty("query");
}
function onlyAllowsArrayOrBooleanForHeadersOf(key) {
    const rules = getMockHeaderRules(key, [
        false,
        true,
        { x: 1 },
        ["user-agent", "accept"]
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].do.set[key]).to.haveOwnProperty("headers");
    chai_1.expect(normalized[1].do.set[key]).to.haveOwnProperty("headers");
    chai_1.expect(normalized[2].do.set[key]).to.not.haveOwnProperty("headers");
    chai_1.expect(normalized[3].do.set[key]).to.haveOwnProperty("headers");
}
function removesInvalidHeadersOf(key) {
    const rules = getMockHeaderRules(key, [
        [null, 3, 4, "user-agent"],
        [{}, ""]
    ]);
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized[0].do.set[key]).to.haveOwnProperty("headers");
    chai_1.expect(normalized[0].do.set[key].headers).to.be.an.instanceOf(Array);
    chai_1.expect(normalized[0].do.set[key].headers).to.have.length(1);
    chai_1.expect(normalized[0].do.set[key].headers[0]).to.equal("user-agent");
    chai_1.expect(normalized[1].do.set[key]).to.not.haveOwnProperty("headers");
}
function throwsForInvalidDoProps() {
    const rules = getMockRules("do", [
        { skip: true }, false, {}, null
    ]);
    chai_1.expect(RulesNormalize_1.default.bind(null, rules)).to.throw;
}
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
    const rules = getMockIfRules("test", [
        () => "Rebel",
        () => { throw new Error(); }
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
        { path: "/users/index", do: { skip: false } },
        { path: "/users/**", do: { skip: false } },
        { path: "/**/index.html", do: { skip: false } } //Is converted to regex
    ];
    const normalized = RulesNormalize_1.default(rules);
    chai_1.expect(normalized).to.have.length(3);
    chai_1.expect(normalized[0].path).to.be.a("string");
    chai_1.expect(normalized[1].path).to.be.instanceOf(RegExp);
    chai_1.expect(normalized[2].path).to.be.instanceOf(RegExp);
}
function correctlyResolvesGlobPaths() {
    const rules = [
        { path: "/users/**", do: { skip: false } },
        { path: "/**/index.html", do: { skip: false } } //Is converted to regex
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
function throwsWhenSkipNotBoolean() {
    const rules = getMockDoRules("skip", [
        null, "false", 1, 0
    ]);
    for (let rule of rules) {
        chai_1.expect(RulesNormalize_1.default.bind(null, [rule])).to.throw(RuleValidationError_1.default)
            .that.has.property("key").that.equals("do.skip");
    }
}
function throwsForInvalidPaths() {
    const rules = getMockRules("path", [
        45, null, "", {}
    ]);
    for (let rule of rules) {
        chai_1.expect(RulesNormalize_1.default.bind(null, [rule])).to.throw(RuleValidationError_1.default)
            .that.has.property("key").that.equals("path");
    }
}
function throwsForInvalidRules() {
    const rules = [null, 4450, "/users", false];
    for (let rule of rules) {
        chai_1.expect(RulesNormalize_1.default.bind(null, [rule])).to.throw(RuleValidationError_1.default);
    }
}
// MOCK RULES GENERATORS
function getMockHeaderRules(forKey, values) {
    return values.map(v => {
        let mock = {
            path: "/",
            do: {
                skip: false,
                set: {}
            }
        };
        mock.do.set[forKey] = { headers: v };
        return mock;
    });
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
function getMockDoRules(withIfKey, values) {
    return values.map(v => {
        let mock = {
            path: "/",
            do: {
                skip: false,
            }
        };
        mock.do[withIfKey] = v;
        return mock;
    });
}
function getMockRules(withKey, values) {
    return values.map(v => {
        let rule = {
            path: "/",
            do: {
                skip: false,
            }
        };
        rule[withKey] = v;
        return rule;
    });
}
//# sourceMappingURL=RulesNormalize.js.map