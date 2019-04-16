"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AccessLogger_1 = require("../lib/logger/AccessLogger");
console.log("Node Version", process.version);
AccessLogger_1.default.debugLog = false;
require("./Utils");
require("./RulesNormalize");
require("./RulesOverseer");
require("./AccessLogger");
//# sourceMappingURL=index.js.map