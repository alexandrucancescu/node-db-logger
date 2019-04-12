declare type AnyObject = {
    [s: string]: any;
};
export declare function deleteProp(of: AnyObject, prop: string): boolean;
export declare function getProp(of: AnyObject, prop: string): any;
export declare function mimeMatch(target: string, pattern: string): boolean;
export declare function getProcessTimeMs(): number;
export declare function cleanUrl(url: string): string;
export declare function wildcardNumberMatch(n: number, template: string): boolean;
export {};
