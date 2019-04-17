declare type AnyObject = {
    [s: string]: any;
};
export declare function deleteProp(of: AnyObject, prop: string): boolean;
export declare function getProp(of: AnyObject, prop: string): any;
/**
 * @returns process time in ms
 */
export declare function getProcessTimeMs(): number;
export {};
