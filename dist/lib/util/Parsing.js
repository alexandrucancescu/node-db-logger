"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ipaddr_js_1 = require("ipaddr.js");
function timeStringToMs(time) {
    const regex = /^(\d+\.?\d*)(ms|s|m|h|d|w|mo|yr)$/gi;
    const parts = regex.exec(time);
    if (!parts || typeof parts[1] !== "string" || typeof parts[2] !== "string") {
        return null;
    }
    const val = Number.parseFloat(parts[1]);
    if (!val)
        return null;
    const multiplier = timeUnitToMsMultiplier(parts[2]);
    if (!multiplier)
        return null;
    return val * multiplier;
}
exports.timeStringToMs = timeStringToMs;
function timeUnitToMsMultiplier(unit) {
    switch (unit) {
        case "ms": return 1;
        case "s": return 1000;
        case "m": return 1000 * 60;
        case "h": return 1000 * 60 * 60;
        case "d": return 1000 * 60 * 60 * 24;
        case "w": return 1000 * 60 * 60 * 24 * 7;
        case "mo": return 1000 * 60 * 60 * 24 * 30;
        case "yr": return 1000 * 60 * 60 * 24 * 365;
        default: return null;
    }
}
/**
 * @summary Checks if the IP is a wrapped IPv4 represented as IPv6
 * @param ip
 * @return the IPv4 representation of the IP
 */
function cleanIp(ip) {
    if (ipaddr_js_1.IPv6.isValid(ip)) {
        const address = ipaddr_js_1.IPv6.parse(ip);
        if (address.isIPv4MappedAddress()) {
            return address.toIPv4Address().toString();
        }
    }
    return ip;
}
exports.cleanIp = cleanIp;
/**
 * Tests a mime-type against a generic, wildcard pattern
 * @param target
 * @param pattern
 * @returns true if the target respects the pattern
 */
function mimeMatch(target, pattern) {
    if (typeof target !== "string" || target.length < 1) {
        return false;
    }
    if (typeof pattern !== "string" || target.length < 1) {
        return false;
    }
    target = target.split(";").shift().replace(/ /g, "");
    const [patternRoot, patternSub] = pattern.split("/");
    const [targetRoot, targetSub] = target.split("/");
    if (patternRoot === "*") {
        if (typeof targetRoot !== "string" || targetRoot.length < 1) {
            return false;
        }
    }
    else if (patternRoot !== targetRoot) {
        return false;
    }
    if (patternSub === "*") {
        return (typeof targetSub === "string" && targetSub.length > 0);
    }
    else {
        return patternSub === targetSub;
    }
}
exports.mimeMatch = mimeMatch;
/**
 * @summary Removes query params and the trailing slash if trimSlash=true
 * @param url Expected to be a valid URL
 * @param trimSlash If the trailing slash should be trimmed, default=true
 * @returns the cleaned URL
 */
function cleanUrl(url, trimSlash = true) {
    let cleaning = url;
    //Remove query parameters
    if (cleaning.indexOf("?") > -1) {
        cleaning = cleaning.split("?").shift();
    }
    //If url has 1 or 0 characters it means it it the root, "/"
    if (cleaning.length <= 1) {
        cleaning = "/";
    }
    else {
        //Remove trailing slash
        if (trimSlash) {
            cleaning = cleaning.replace(/\/$/, "");
        }
    }
    return cleaning;
}
exports.cleanUrl = cleanUrl;
/**
 * @summary Checks numbers against a wildcard template. Use '*' for any digit
            (n:404,template:'4**') => true
            (n:401,template:'4*1') => false
 * @param n The number to test against the template, only works for n>=0
 * @param template
 * @returns true if the number respects the template
 */
function wildcardNumberMatch(n, template) {
    if (n < 0)
        return false;
    const strNr = n.toString();
    if (strNr.length !== template.length) {
        return false;
    }
    for (let i = 0; i < template.length; i++) {
        const char = template.charAt(i);
        if (char !== "*" && char !== strNr.charAt(i)) {
            return false;
        }
    }
    return true;
}
exports.wildcardNumberMatch = wildcardNumberMatch;
//# sourceMappingURL=Parsing.js.map