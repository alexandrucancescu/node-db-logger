export declare function timeStringToMs(time: string): number;
/**
 * @summary Checks if the IP is a wrapped IPv4 represented as IPv6
 * @param ip
 * @return the IPv4 representation of the IP
 */
export declare function cleanIp(ip: string): string;
/**
 * Tests a mime-type against a generic, wildcard pattern
 * @param target
 * @param pattern
 * @returns true if the target respects the pattern
 */
export declare function mimeMatch(target: string, pattern: string): boolean;
/**
 * @summary Removes query params and the trailing slash if trimSlash=true
 * @param url Expected to be a valid URL
 * @param trimSlash If the trailing slash should be trimmed, default=true
 * @returns the cleaned URL
 */
export declare function cleanUrl(url: string, trimSlash?: boolean): string;
/**
 * @summary Checks numbers against a wildcard template. Use '*' for any digit
            (n:404,template:'4**') => true
            (n:401,template:'4*1') => false
 * @param n The number to test against the template, only works for n>=0
 * @param template
 * @returns true if the number respects the template
 */
export declare function wildcardNumberMatch(n: number, template: string): boolean;
