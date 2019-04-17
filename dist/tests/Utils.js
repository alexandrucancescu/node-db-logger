"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const Generic_1 = require("../lib/util/Generic");
const Parsing_1 = require("../lib/util/Parsing");
mocha_1.describe("Util functions", () => {
    mocha_1.describe("Wildcard mime match", () => {
        mocha_1.it("should match mime", mimeMatchTrue);
        mocha_1.it("should not match mime", mimeMatchFalse);
    });
    mocha_1.describe("Wildcard number match", () => {
        mocha_1.it("should match number", wildcardNumberTrue);
        mocha_1.it("should not match number", wildcardNumberFalse);
        mocha_1.it("should throw error", wildcardNumberThrow);
    });
    mocha_1.describe("Clean URL", () => {
        mocha_1.it("should return cleaned URL", cleanURL);
        mocha_1.it("should throw error", cleanURLThrow);
    });
    mocha_1.describe("Get nested property by name", () => {
        mocha_1.it("should return the correct value for prop", getsCorrectProp);
        mocha_1.it("should return undefined for nonexistent prop", getPropReturnsUndefined);
    });
    mocha_1.describe("Delete nested property by name", () => {
        mocha_1.it("should delete the right property", deletesCorrectProp);
        mocha_1.it("should return false when property does not exist", deletePropReturnsFalse);
    });
    mocha_1.describe("Time string to ms", () => {
        mocha_1.it("should return the right ms representation of time string", returnsRightTimeMs);
        mocha_1.it("should return null for invalid time string", returnsNullForInvalidTimeStrings);
    });
});
function returnsNullForInvalidTimeStrings() {
    chai_1.expect(Parsing_1.timeStringToMs("10")).to.be.null;
    chai_1.expect(Parsing_1.timeStringToMs("..m")).to.be.null;
    chai_1.expect(Parsing_1.timeStringToMs(33)).to.be.null;
}
function returnsRightTimeMs() {
    chai_1.expect(Parsing_1.timeStringToMs("10m")).to.be.approximately(600000, 0.001);
    chai_1.expect(Parsing_1.timeStringToMs("10.1s")).to.be.approximately(10100, 0.001);
    chai_1.expect(Parsing_1.timeStringToMs("10yr")).to.be.approximately(3.154e+11, 1e11);
}
function deletePropReturnsFalse() {
    const obj = {
        x: {
            y: {
                z: {
                    w: 99
                },
                v: {
                    w: 98,
                }
            }
        }
    };
    chai_1.expect(Generic_1.deleteProp(obj, "x.y.wrong")).to.be.false;
    chai_1.expect(Generic_1.deleteProp(null, "x.y.wrong")).to.not.throw;
    chai_1.expect(Generic_1.deleteProp(null, "x.y.wrong")).to.be.false;
    chai_1.expect(Generic_1.deleteProp(obj, null)).to.not.throw;
    chai_1.expect(Generic_1.deleteProp(obj, null)).to.be.false;
}
function deletesCorrectProp() {
    const obj = {
        x: {
            y: {
                z: {
                    w: 99
                },
                v: {
                    w: 98,
                }
            }
        }
    };
    chai_1.expect(Generic_1.deleteProp(obj, "x.y.z.w")).to.be.true;
    chai_1.expect(obj.x.y.z).to.not.haveOwnProperty("w");
    chai_1.expect(Generic_1.deleteProp(obj, "x.y.z")).to.be.true;
    chai_1.expect(obj.x.y).to.not.haveOwnProperty("z");
}
function getPropReturnsUndefined() {
    const obj = {
        x: {
            y: {
                z: {
                    w: 99
                },
                v: {
                    w: 98,
                }
            }
        }
    };
    chai_1.expect(Generic_1.getProp(obj, "x.y.www")).to.be.undefined;
    chai_1.expect(Generic_1.getProp(obj, true)).to.be.undefined;
    chai_1.expect(Generic_1.getProp(obj, "")).to.be.undefined;
}
function getsCorrectProp() {
    const obj = {
        x: {
            y: {
                z: {
                    w: 99
                },
                v: {
                    w: 98,
                }
            }
        }
    };
    chai_1.expect(Generic_1.getProp(obj, "x.y.z.w")).to.equal(99);
    chai_1.expect(Generic_1.getProp(obj, "x.y.v.w")).to.equal(98);
    chai_1.expect(Generic_1.getProp(obj, "x.y")).to.deep.equal({
        z: { w: 99 }, v: { w: 98, }
    });
}
function cleanURLThrow() {
    chai_1.expect(Parsing_1.cleanUrl.bind({}, [45, "?"])).to.throw();
    chai_1.expect(Parsing_1.cleanUrl.bind({}, null)).to.throw();
}
function cleanURL() {
    chai_1.expect(Parsing_1.cleanUrl("")).to.equal("/");
    chai_1.expect(Parsing_1.cleanUrl("/users/")).to.equal("/users");
    chai_1.expect(Parsing_1.cleanUrl("/users/?x=1")).to.equal("/users");
    chai_1.expect(Parsing_1.cleanUrl("/users?x=3")).to.equal("/users");
}
function wildcardNumberThrow() {
    chai_1.expect(Parsing_1.wildcardNumberMatch.bind({}, undefined, ""))
        .to.throw();
    chai_1.expect(Parsing_1.wildcardNumberMatch.bind({}, 40, [50, 60]))
        .to.throw();
}
function wildcardNumberTrue() {
    chai_1.expect(Parsing_1.wildcardNumberMatch(501, "***"))
        .to.equal(true);
    chai_1.expect(Parsing_1.wildcardNumberMatch(501, "*01"))
        .to.equal(true);
    chai_1.expect(Parsing_1.wildcardNumberMatch(501, "5**"))
        .to.equal(true);
    chai_1.expect(Parsing_1.wildcardNumberMatch(0, "*"))
        .to.equal(true);
    chai_1.expect(Parsing_1.wildcardNumberMatch(533, "533"))
        .to.equal(true);
}
function wildcardNumberFalse() {
    chai_1.expect(Parsing_1.wildcardNumberMatch(501, "**"))
        .to.equal(false);
    chai_1.expect(Parsing_1.wildcardNumberMatch(501, "**2"))
        .to.equal(false);
    chai_1.expect(Parsing_1.wildcardNumberMatch(NaN, "*"))
        .to.equal(false);
    chai_1.expect(Parsing_1.wildcardNumberMatch(-1, "**"))
        .to.equal(false);
}
function mimeMatchTrue() {
    chai_1.expect(Parsing_1.mimeMatch("application/json; charset=utf-8", "application/*"))
        .to.equal(true);
    chai_1.expect(Parsing_1.mimeMatch("image/jpeg; charset=utf-8", "image/jpeg"))
        .to.equal(true);
    chai_1.expect(Parsing_1.mimeMatch("image/jpeg", "*/*"))
        .to.equal(true);
    chai_1.expect(Parsing_1.mimeMatch("/", "/"))
        .to.equal(true);
}
function mimeMatchFalse() {
    chai_1.expect(Parsing_1.mimeMatch("/", "image/jpeg"))
        .to.equal(false);
    chai_1.expect(Parsing_1.mimeMatch(undefined, null))
        .to.equal(false);
    chai_1.expect(Parsing_1.mimeMatch({}, "image/jpeg"))
        .to.equal(false);
    chai_1.expect(Parsing_1.mimeMatch("*/*", "/"))
        .to.equal(false);
    chai_1.expect(Parsing_1.mimeMatch("image/jpeg", "application/*"))
        .to.equal(false);
}
//# sourceMappingURL=Utils.js.map