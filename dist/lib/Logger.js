"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
}
Logger.configuration = {
    debug: true,
    defaultRouteRoute: {
        path: "/**",
        do: {
            set: {
                request: {
                    query: true,
                    userData: true,
                    body: false,
                    headers: ["user-agent"]
                },
                response: {
                    body: false,
                    headers: false,
                },
            },
        },
        priority: -1
    },
};
exports.default = Logger;
//# sourceMappingURL=Logger.js.map