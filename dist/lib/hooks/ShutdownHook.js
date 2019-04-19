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
const Generic_1 = require("../util/Generic");
class ShutdownHook {
    static mount() {
        if (this.isMounted)
            return;
        process.on("beforeExit", this.onShutdown.bind(this));
        this.isMounted = true;
    }
    static onShutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("beforeExit");
            const promises = [];
            while (this.handlers.length > 0) {
                const handler = this.handlers.shift();
                try {
                    const promise = handler();
                    if (promise instanceof Promise) {
                        promises.push(Generic_1.wrapPromise(promise));
                    }
                }
                catch (e) { }
            }
            yield Promise.all(promises);
        });
    }
}
ShutdownHook.handlers = [];
ShutdownHook.isMounted = false;
exports.default = ShutdownHook;
//# sourceMappingURL=ShutdownHook.js.map