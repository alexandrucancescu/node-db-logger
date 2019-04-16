import AccessLogger from "../lib/logger/AccessLogger";

console.log("Node Version",process.version);

AccessLogger.debugLog=false;

import "./Utils"
import "./RulesNormalize"
import "./RulesOverseer"
import "./AccessLogger"