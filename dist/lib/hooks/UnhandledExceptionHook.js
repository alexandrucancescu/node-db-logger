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
class UnhandledExceptionHook {
    static mount(exitAfter = true) {
        if (this.isMounted)
            return;
        this.exitAfter = exitAfter;
        process.on("uncaughtException", this.onException.bind(this));
        this.isMounted = true;
    }
    static onException(error) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            while (this.observers.length > 0) {
                const handler = this.observers.shift();
                try {
                    const promise = handler(error);
                    if (promise instanceof Promise) {
                        promises.push(Generic_1.wrapPromise(promise));
                    }
                }
                catch (e) { }
            }
            if (promises.length > 0) {
                yield Promise.all(promises);
            }
            if (this.exitAfter) {
                process.exit(1);
            }
        });
    }
    static addObserver(observer) {
        if (this.observers.indexOf(observer) > -1)
            return;
        this.observers.push(observer);
    }
}
UnhandledExceptionHook.observers = [];
UnhandledExceptionHook.isMounted = false;
UnhandledExceptionHook.exitAfter = true;
exports.default = UnhandledExceptionHook;
//# sourceMappingURL=UnhandledExceptionHook.js.map