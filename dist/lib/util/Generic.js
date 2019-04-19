"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deleteProp(of, prop) {
    if (typeof prop !== "string" || typeof of !== "object" || of === null) {
        return false;
    }
    const keys = prop.split(".");
    let parent = of;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (parent.hasOwnProperty(key)) {
            if (i === keys.length - 1) {
                delete parent[key];
                return true;
            }
            else {
                parent = parent[key];
            }
        }
        else {
            return false;
        }
    }
}
exports.deleteProp = deleteProp;
function getProp(of, prop) {
    if (typeof prop !== "string") {
        return undefined;
    }
    const keys = prop.split(".");
    let val = of;
    for (let key of keys) {
        if (val.hasOwnProperty(key)) {
            val = val[key];
        }
        else {
            return undefined;
        }
    }
    return val;
}
exports.getProp = getProp;
/**
 * @summary Wrap a promise so that it cannot be rejected
 * @param promise
 */
function wrapPromise(promise) {
    return new Promise(resolve => {
        promise.then(resolve).catch(resolve);
    });
}
exports.wrapPromise = wrapPromise;
/**
 * @returns process time in ms
 */
function getProcessTimeMs() {
    const [sec, nano] = process.hrtime();
    return (sec * 1000) + (nano / Math.pow(10, 6));
}
exports.getProcessTimeMs = getProcessTimeMs;
//# sourceMappingURL=Generic.js.map