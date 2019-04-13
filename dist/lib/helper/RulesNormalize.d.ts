import PublicRouteRule, { Path } from "../domain/access-log/RouteRule";
declare type RouteRule = PublicRouteRule & {
    _originalPath?: Path;
};
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
