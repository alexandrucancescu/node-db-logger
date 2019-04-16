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
const express = require("express");
const bodyParser = require("body-parser");
const http_1 = require("http");
const app = express();
app.use([
    bodyParser.json(),
    bodyParser.text(),
    bodyParser.urlencoded({ extended: true, })
]);
let server = http_1.createServer(app);
function mountMiddleware(middleware) {
    app.use(middleware);
}
exports.mountMiddleware = mountMiddleware;
function mountRoutes() {
    const emptyResponseRoutes = [
        "/test_query",
        "/test_skip",
        "/test_skip_2",
        "/test_ua_user_data",
        "/test_body_headers",
    ];
    app.use(emptyResponseRoutes, (ignored_req, res, ignored_next) => res.sendStatus(200).end());
    app.mkactivity("/test_info", (ignored_req, res, ignored_next) => res.sendStatus(309).end());
}
exports.mountRoutes = mountRoutes;
function start(port = 29876, ip = "127.0.0.1") {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            server.on("listening", resolve)
                .on("error", (err) => {
                console.error(err);
                reject(err);
            })
                .listen(port, ip);
        });
    });
}
exports.start = start;
function stop() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
exports.stop = stop;
//# sourceMappingURL=ExpressServer.js.map