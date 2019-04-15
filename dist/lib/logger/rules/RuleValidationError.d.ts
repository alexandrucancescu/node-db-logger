import PublicRouteRule, { Path } from "../../domain/access-log/RouteRule";
declare type RouteRule = PublicRouteRule & {
    _originalPath?: Path;
};
export default class RuleValidationError extends Error {
    private readonly rule;
    private readonly key;
    private readonly ruleIdentifier;
    constructor(rule: RouteRule, key?: string);
    shouldBe(type: string): this;
    invalidRule(): this;
    invalidKey(): this;
    validationError(error: string): this;
}
export {};
