"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime_match_1 = require("mime-match");
/*
    Tests a mime-type against a generic, wildcard pattern
 */
function mimeMatch(pattern, target) {
    if (typeof target !== "string" || target.length < 1) {
        return false;
    }
    if (typeof pattern !== "string" || target.length < 1) {
        return false;
    }
    return mime_match_1.default(pattern, target);
}
exports.mimeMatch = mimeMatch;
/*
    Returns the process time in ms
 */
function getProcessTimeMs() {
    const [sec, nano] = process.hrtime();
    return (sec * 1000) + (nano / Math.pow(10, 6));
}
exports.getProcessTimeMs = getProcessTimeMs;
/*
    Cleans URL paths from trailing slashes and query parameters
    Expects input URL to be valid
 */
function cleanUrl(url) {
    let cleaning = url;
    if (cleaning.length > 1) {
        //Remove query parameters
        if (cleaning.indexOf("?") > -1) {
            cleaning = cleaning.split("?").shift();
        }
        //Remove trailing slash
        cleaning = cleaning.replace(/\/$/, "");
    }
    else if (cleaning.length < 1) {
        cleaning = "/";
    }
    return cleaning;
}
exports.cleanUrl = cleanUrl;
/*
    Checks numbers against a wildcard template. Use '*' for any digit
    (n:404,template:'4**') => true
    (n:401,template:'4*1') => false
 */
function wildcardNumberMatch(n, template) {
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
//# sourceMappingURL=Generic.js.map