"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const RulesOverseer_1 = require("../lib/helper/RulesOverseer");
mocha_1.describe("Rules Overseer", () => {
    mocha_1.it("should return the correct act based on path rules", returnsCorrectActPathRules);
    mocha_1.it("should return the merged act from multiple rules", returnsMergedActFromRules);
});
function returnsCorrectActPathRules() {
    const response = { headersSent: true };
    const overseer = new RulesOverseer_1.default([
        { path: "/**", do: { skip: true } },
        { path: "/company", do: { skip: false } },
        { path: "/company/user", do: { skip: true } },
        { path: "/company/user/admin", do: { skip: false, set: { request: { userData: true } } } },
    ]);
    chai_1.expect(overseer.computeRouteAct({ url: "/index" }, response))
        .to.deep.equal({ skip: true });
    chai_1.expect(overseer.computeRouteAct({ url: "/company" }, response))
        .to.deep.equal({ skip: false });
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user" }, response))
        .to.deep.equal({ skip: true });
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user/admin" }, response))
        .to.deep.equal({ skip: false, set: { request: { userData: true } } });
}
function returnsMergedActFromRules() {
    const response = { headersSent: true };
    const overseer = new RulesOverseer_1.default([
        { path: "/**", do: { skip: true } },
        { path: "/company", do: { set: { request: { headers: ["user-agent"] } } } },
        { path: "/company/user", do: { skip: false, set: { response: { body: true } } } },
        { path: "/company/user/admin", do: { skip: false, set: { request: { userData: true } } } },
    ]);
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user" }, response))
        .to.deep.equal({ skip: true });
    chai_1.expect(overseer.computeRouteAct({ url: "/company" }, response))
        .to.deep.equal({ skip: false });
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user" }, response))
        .to.deep.equal({ skip: true });
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user/admin" }, response))
        .to.deep.equal({ skip: false, set: { request: { userData: true } } });
}
//# sourceMappingURL=RulesOverseer.js.map