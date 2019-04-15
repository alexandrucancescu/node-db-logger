import PublicRouteRule, { Path } from "../../domain/access-log/RouteRule";
declare type RouteRule = PublicRouteRule & {
    _originalPath?: Path;
};
/**
 * Ensures rules have a valid path and .do action
 * Cleans urls
 * Converts glob pattern paths to regex paths
 * Removes invalid properties from rules
 *
 *
 * @param rules = rules passed to the RulesOverseer constructor
 * @returns the valid rules
 */
export default function normalizeRules(rules: RouteRule[], trimSlash?: boolean): RouteRule[];
export {};
