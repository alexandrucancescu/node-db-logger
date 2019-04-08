import RouteRule from "../domain/access-log/RouteRule";
/**
 * Removes rules with invalid paths
 * Removes invalid properties from rules
 *
 *
 * @param rules = rules passed to the constructor
 * @returns the valid rules
 */
export default function normalizeRules(rules: RouteRule[]): RouteRule[];
