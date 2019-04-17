"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai = require("chai");
const SinonChai = require("sinon-chai");
const sinon_1 = require("sinon");
const mockApp = require("./mock/ExpressServer");
const request = require("phin");
const AccessLogger_1 = require("../lib/logger/AccessLogger");
const expect = chai.expect;
chai.use(SinonChai);
const PORT = 29876;
const HOST = "127.0.0.1";
const URL = `http://${HOST}:${PORT}`;
const USER_DATA = { name: "Paul", age: 30, privilege: "admin" };
mocha_1.describe("AccessLogger", () => {
    mocha_1.describe("Exceptions", () => {
        mocha_1.it("should throw if transports are invalid", throwsInvalidTransports);
        mocha_1.it("should throw if rules are not valid", throwsInvalidRules);
        mocha_1.it("should throw if config or config parameters are invalid", throwsInvalidConfig);
    });
    mocha_1.describe("Transport calls", () => {
        mocha_1.before(createMockApp);
        mocha_1.afterEach(() => transport.transport.resetHistory());
        mocha_1.it("should skip request if skip:true and not call transport", skipsRequest);
        mocha_1.it("should skip request if act is null and not call transport", skipsRequestActNull);
        mocha_1.it("should send to the transport the correct http method, remote ip, path and response code", sendsCorrectInfo);
        mocha_1.it("should send transport request info and query parameters", sendsQuery);
        mocha_1.it("should send transport user-agent header and user data", sendsUaAndUserData);
        mocha_1.it("should send transport the request body and all request headers", sendsBodyAndAllHeaders);
        mocha_1.it("should send transport tht response headers", sendsResponseHeaders);
        mocha_1.after(mockApp.stop);
    });
});
function sendsQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = '/test_query';
        yield request({
            method: "GET",
            url: `${URL}${PATH}?x=1&y=2`,
        });
        expect(transport.transport).to.have.been.calledWith({
            request: {
                method: "GET",
                path: PATH,
                remote_address: HOST,
                query: {
                    x: "1",
                    y: "2",
                }
            },
            response: {
                code: 200,
                responseTime: sinon_1.match.number,
            }
        });
    });
}
function sendsUaAndUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = "/test_ua_user_data";
        yield request({
            method: "GET",
            url: `${URL}${PATH}?x=1`,
            headers: {
                'user-agent': 'JamesBond/1.3 Gecko/0.9'
            }
        });
        expect(transport.transport).to.have.been.calledWith({
            request: {
                method: "GET",
                path: PATH,
                remote_address: HOST,
                userData: USER_DATA,
                headers: {
                    'user-agent': 'JamesBond/1.3 Gecko/0.9'
                }
            },
            response: {
                code: 200,
                responseTime: sinon_1.match.number,
            }
        });
    });
}
function sendsBodyAndAllHeaders() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = "/test_req_body_headers";
        const METHOD = "POST";
        const HEADERS = {
            'user-agent': 'JamesBond/1.3 Gecko/0.9',
            'content-type': 'application/json',
        };
        const DATA = { score: 10, for: ['n', 'o', 'd', 'e'] };
        yield request({
            method: METHOD,
            url: `${URL}${PATH}`,
            headers: HEADERS,
            data: DATA
        });
        expect(transport.transport).to.have.been.calledWith({
            request: {
                method: METHOD,
                path: PATH,
                remote_address: HOST,
                headers: sinon_1.match.has('user-agent').and(sinon_1.match.has('content-type')).and(sinon_1.match.has('host')),
                body: DATA,
            },
            response: {
                code: 200,
                responseTime: sinon_1.match.number,
            }
        });
    });
}
function sendsResponseHeaders() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = "/test_res_headers";
        const METHOD = "GET";
        yield request({
            method: METHOD,
            url: `${URL}${PATH}`,
        });
        expect(transport.transport).to.have.been.calledWith({
            request: {
                method: METHOD,
                path: PATH,
                remote_address: HOST,
            },
            response: {
                code: 200,
                responseTime: sinon_1.match.number,
                headers: sinon_1.match.has("pragma", "no-cache")
                    .and(sinon_1.match.has("x-powered-by", "nodejs"))
                    .and(sinon_1.match.has("content-type", sinon_1.match(/application\/json.*/)))
                    .and(sinon_1.match.has("content-length", sinon_1.match(/[0-9]*/)))
            }
        });
    });
}
function sendsCorrectInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = "/test_info";
        const METHOD = "MKACTIVITY";
        yield request({
            method: METHOD,
            url: `${URL}${PATH}`,
        });
        expect(transport.transport).to.have.been.calledWith({
            request: {
                method: METHOD,
                path: PATH,
                remote_address: HOST,
            },
            response: {
                code: 309,
                responseTime: sinon_1.match.number,
            }
        });
    });
}
function skipsRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        yield request({
            method: "GET",
            url: `${URL}/test_skip`
        });
        expect(transport.transport).to.have.not.been.called;
    });
}
function skipsRequestActNull() {
    return __awaiter(this, void 0, void 0, function* () {
        yield request({
            method: "GET",
            url: `${URL}/test_skip2`
        });
        expect(transport.transport).to.have.not.been.called;
    });
}
function throwsInvalidRules() {
    expect(() => {
        new AccessLogger_1.default([], null);
    }).to.throw;
    expect(() => {
        new AccessLogger_1.default([], [{}]);
    }).to.throw;
}
function throwsInvalidConfig() {
    expect(() => {
        new AccessLogger_1.default([], [], null);
    }).to.throw;
    expect(() => {
        new AccessLogger_1.default([], [], { removeTrailingSlash: false, getUserData: true });
    }).to.throw;
    expect(() => {
        new AccessLogger_1.default([], [], { removeTrailingSlash: 88 });
    }).to.throw;
}
function throwsInvalidTransports() {
    expect(() => {
        new AccessLogger_1.default(null, []);
    }).to.throw;
    expect(() => {
        new AccessLogger_1.default([{}], [], null);
    }).to.throw;
    expect(() => {
        new AccessLogger_1.default([{ transport: 88 }], [], null);
    }).to.throw;
}
//MOCK Access Logger and express app
const rules = [
    {
        path: "/test_info",
        do: {
            skip: false,
        }
    },
    {
        path: "/test_query",
        do: {
            skip: false,
            set: {
                request: {
                    query: true
                }
            }
        }
    },
    {
        path: "/test_skip",
        do: {
            skip: true,
        }
    },
    {
        path: "/test_ua_user_data",
        do: {
            set: {
                request: {
                    userData: true,
                    headers: ["user-agent"]
                },
            }
        }
    },
    {
        path: "/test_body_headers",
        do: {
            set: {
                request: {
                    body: true,
                    headers: true,
                }
            }
        }
    },
    {
        path: "/test_res_headers",
        do: {
            set: {
                response: {
                    headers: true,
                }
            }
        }
    }
];
const transport = { transport: sinon_1.spy() };
const accessLogger = new AccessLogger_1.default([transport], rules, {
    removeTrailingSlash: true,
    getUserData() {
        return USER_DATA;
    }
});
function createMockApp() {
    return __awaiter(this, void 0, void 0, function* () {
        mockApp.mountMiddleware(accessLogger.express);
        mockApp.mountRoutes();
        yield mockApp.start(PORT, HOST);
    });
}
//# sourceMappingURL=AccessLogger.js.map