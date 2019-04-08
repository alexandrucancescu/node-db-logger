/// <reference types="express-serve-static-core" />
import { SkipRule } from "../config/Types";
export default class SkipMinder {
    private readonly skipRules;
    constructor(skipRules: SkipRule[]);
    shouldSkip(path: string, res: Express.Response): {
        stdout: boolean;
        main: boolean;
    };
    private static statusCodeMatch;
    private getMatchingRulesFor;
    private cleanRulesUrls;
}
