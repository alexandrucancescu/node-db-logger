import PublicRouteRule, { Path } from "../domain/access-log/RouteRule";
declare type RouteRule = PublicRouteRule & {
    _originalPath?: Path;
};
export declare class RuleValidationError extends Error {
    private readonly rule;
    private readonly key;
    private readonly ruleIdentifier;
    constructor(rule: RouteRule, key?: string);
    shouldBe(type: string): this;
    invalidRule(): this;
    invalidKey(): this;
}
/**
 * Removes rules with invalid paths
 * Cleans urls
 * Converts glob pattern paths to regex paths
 * Removes invalid properties from rules
 *
 *
 * @param rules = rules passed to the constructor
 * @returns the valid rules
 */
export default function normalizeRules(rules: RouteRule[]): RouteRule[];
export {};
