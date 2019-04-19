declare type AnyObject = {
    [s: string]: any;
};
export declare function deleteProp(of: AnyObject, prop: string): boolean;
export declare function getProp(of: AnyObject, prop: string): any;
/**
 * @summary Wrap a promise so that it cannot be rejected
 * @param promise
 */
export declare function wrapPromise<T>(promise: Promise<T>): Promise<T>;
/**
 * @returns process time in ms
 */
export declare function getProcessTimeMs(): number;
export {};
