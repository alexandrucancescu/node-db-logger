"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const RulesOverseer_1 = require("../lib/logger/rules/RulesOverseer");
mocha_1.describe("Rules Overseer", () => {
    mocha_1.it("should return the correct act based on path rules", returnsCorrectActPathRules);
    mocha_1.it("should return the merged act from multiple rules", returnsMergedActFromRules);
    mocha_1.it("should correctly pass if no conditionals", passesWhenNoConditionals);
    mocha_1.it("should correctly resolve the status code conditional", resolvesStatusCodeConditional);
    mocha_1.it("should correctly resolve the contentType conditional", resolvesContentTypeConditional);
    mocha_1.it("should correctly resolve the custom test conditional", resolvesTheTestConditional);
    mocha_1.it("should correctly resolve the requestUnfulfilled conditional", resolvesRequestUnfulfilledConditional);
    mocha_1.it("should correctly resolve multiple conditionals until one is true or none are", resolvesMultipleConditionals);
    mocha_1.it("should also compare trailing slashes on paths when trimSlash is false", comparesTrailingSlash);
});
function comparesTrailingSlash() {
    const overseer = new RulesOverseer_1.default([
        {
            path: "/company",
            do: {
                set: {
                    request: {
                        headers: ["user-agent"]
                    }
                }
            }
        }
    ], false);
    const req_no_trailing = mockRequest({ path: "/company" });
    const req_trailing = mockRequest({ path: "/company/" });
    chai_1.expect(overseer.computeRouteAct(req_no_trailing, res_html_200))
        .to.have.ownProperty("set")
        .which.has.ownProperty("request")
        .which.has.ownProperty("headers")
        .which.deep.equals(["user-agent"]);
    chai_1.expect(overseer.computeRouteAct(req_trailing, res_html_200))
        .to.not.have.ownProperty("set");
}
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
        { path: "/company/**", do: { set: { request: { headers: ["user-agent"] } } } },
        { path: "/company/user", do: { skip: false, set: { response: { body: true } } } },
        { path: "/company/user/admin", do: { skip: false, set: { request: { userData: true } } } },
    ]);
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user" }, response))
        .to.deep.equal({
        skip: false,
        set: {
            request: {
                headers: ["user-agent"]
            },
            response: {
                body: true
            },
        }
    });
    chai_1.expect(overseer.computeRouteAct({ url: "/company/user/admin" }, response))
        .to.deep.equal({
        skip: false,
        set: {
            request: {
                headers: ["user-agent"],
                userData: true,
            },
        }
    });
    chai_1.expect(overseer.computeRouteAct({ url: "/about" }, response))
        .to.deep.equal({
        skip: true,
    });
}
function passesWhenNoConditionals() {
    const request_index = { url: "/index" };
    chai_1.expect(overseer_1.computeRouteAct(request_index, res_json_409))
        .to.deep.equal({ skip: false, set: { request: { query: true } } });
}
function resolvesStatusCodeConditional() {
    const request_company = { url: "/company" };
    chai_1.expect(overseer_1.computeRouteAct(request_company, res_json_409).skip)
        .to.be.true;
    chai_1.expect(overseer_1.computeRouteAct(request_company, res_json_200))
        .to.deep.equal({ skip: false, set: { request: { query: true } } });
}
function resolvesContentTypeConditional() {
    const req_company_ceo = mockRequest({ path: "/company/ceo" });
    let response = chai_1.expect(overseer_1.computeRouteAct(req_company_ceo, res_json_200))
        .to.haveOwnProperty("set")
        .that.has.ownProperty("response");
    response.has.ownProperty("headers").which.deep.equals(["content-type"]);
    response.has.ownProperty("body").which.is.true;
    chai_1.expect(overseer_1.computeRouteAct(req_company_ceo, res_xml_200))
        .to.haveOwnProperty("skip").which.is.true;
    const actHtml = overseer_1.computeRouteAct(req_company_ceo, res_html_500);
    chai_1.expect(actHtml).to.haveOwnProperty("skip").which.is.true;
    chai_1.expect(actHtml).to.not.haveOwnProperty("response");
}
function resolvesTheTestConditional() {
    const request_test_false = mockRequest({ path: "/about_us/", headers: { referer: "google.com" } });
    const request_test_true = mockRequest({ path: "/about_us/", headers: { referer: "bing.com" } });
    chai_1.expect(overseer_1.computeRouteAct(request_test_false, res_json_200))
        .to.have.haveOwnProperty("set")
        .that.has.ownProperty("request")
        .that.does.not.have.ownProperty("userData");
    chai_1.expect(overseer_1.computeRouteAct(request_test_true, res_json_200))
        .to.haveOwnProperty("set")
        .that.has.ownProperty("request")
        .that.has.ownProperty("userData")
        .that.is.true;
}
function resolvesRequestUnfulfilledConditional() {
    const req_api_users = mockRequest({ path: "/api/users" });
    chai_1.expect(overseer_1.computeRouteAct(req_api_users, res_json_200))
        .to.haveOwnProperty("skip")
        .that.is.true;
    chai_1.expect(overseer_1.computeRouteAct(req_api_users, res_unfulfilled))
        .to.haveOwnProperty("skip")
        .that.is.false;
}
function resolvesMultipleConditionals() {
    const overseer = new RulesOverseer_1.default([
        {
            path: "/**",
            do: { skip: false }
        },
        {
            path: "/api/users",
            do: {
                skip: true,
            },
            if: {
                statusCode: ["5**", 404],
                contentType: "application/*",
                requestUnfulfilled: true
            }
        },
        {
            path: "/api/posts",
            do: {
                set: {
                    request: { userData: true }
                },
            },
            if: {
                statusCode: "4**",
                test() {
                    return true;
                }
            }
        }
    ]);
    //USERS API
    const req_api_users = mockRequest({ path: "/api/users" });
    chai_1.expect(overseer.computeRouteAct(req_api_users, res_unfulfilled))
        .to.haveOwnProperty("skip").that.is.true;
    chai_1.expect(overseer.computeRouteAct(req_api_users, res_html_500))
        .to.haveOwnProperty("skip").that.is.true;
    chai_1.expect(overseer.computeRouteAct(req_api_users, res_html_200))
        .to.haveOwnProperty("skip").that.equals(false);
    //POSTS API
    const req_api_posts = mockRequest({ path: "/api/posts" });
    chai_1.expect(overseer.computeRouteAct(req_api_posts, res_unfulfilled))
        .to.have.ownProperty("set");
}
//MOCK DATA & GENERATORS
//Overseers mock
const overseer_1 = new RulesOverseer_1.default([
    {
        path: "/**",
        do: {
            skip: false,
            set: {
                request: {
                    query: true
                }
            }
        },
    },
    {
        path: "/company",
        do: {
            skip: true,
        },
        if: {
            statusCode: ["4**", "5**"]
        }
    },
    {
        path: "/company/ceo",
        do: {
            set: {
                response: {
                    headers: ["content-type"],
                    body: true
                }
            }
        },
        if: {
            contentType: "application/*"
        }
    },
    {
        path: "/company/ceo",
        do: {
            skip: true
        },
        if: {
            contentType: ["text/html", "*/xml"]
        }
    },
    {
        path: "/about_us",
        do: {
            set: {
                request: {
                    userData: true
                }
            }
        },
        if: {
            test(req, res) {
                return req.headers.referer !== "google.com";
            }
        }
    },
    {
        path: "/api/**",
        do: {
            skip: true
        }
    },
    {
        path: "/api/users",
        do: {
            skip: false,
        },
        if: {
            requestUnfulfilled: true,
        }
    },
]);
const overseer_2 = new RulesOverseer_1.default([
    {
        path: "/**",
        do: {
            skip: false,
            set: {
                request: {
                    query: true
                }
            }
        },
    },
    {
        path: "/company",
        do: {
            skip: true,
        },
        if: {
            statusCode: ["4**", "5**"]
        }
    },
    {
        path: "/company/ceo",
        do: {
            set: {
                response: {
                    headers: ["content-type"]
                }
            }
        },
        if: {
            contentType: "application/*"
        }
    },
    {
        path: "/about_us",
        do: {
            set: {
                request: {
                    userData: true
                }
            }
        },
        if: {
            test(req, res) {
                return req.headers.referer !== "google.com";
            }
        }
    },
    {
        path: "/api/**",
        do: {
            skip: true
        }
    },
    {
        path: "/api/users",
        do: {
            skip: false,
        },
        if: {
            requestUnfulfilled: true,
        }
    },
]);
//Responses
const res_json_409 = mockResponse({ headersSent: true, statusCode: 409, headers: { 'content-type': "application/json" } });
const res_json_200 = mockResponse({ headersSent: true, statusCode: 200, headers: { 'content-type': "application/json" } });
const res_html_200 = mockResponse({ headersSent: true, statusCode: 200, headers: { 'content-type': "text/html" } });
const res_html_500 = mockResponse({ headersSent: true, statusCode: 500, headers: { 'content-type': "text/html" } });
const res_xml_200 = mockResponse({ headersSent: true, statusCode: 200, headers: { 'content-type': "application/xml" } });
const res_unfulfilled = mockResponse({ headersSent: false });
//Response generator
function mockRequest(req) {
    return {
        url: req.path,
        originalUrl: req.path,
        baseUrl: req.path,
        get(h) {
            if (req.headers && req.headers[h]) {
                return req.headers[h];
            }
            return undefined;
        },
        headers: req.headers
    };
}
function mockResponse(res) {
    return {
        headersSent: res.headersSent === true,
        statusCode: res.statusCode,
        getHeader(h) {
            if (res.headers && res.headers[h]) {
                return res.headers[h];
            }
            return undefined;
        }
    };
}
//# sourceMappingURL=RulesOverseer.js.map