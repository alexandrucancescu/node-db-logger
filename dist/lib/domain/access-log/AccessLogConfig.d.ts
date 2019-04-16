import { Request, Response } from "express";
export interface AccessLogConfig {
    removeTrailingSlash: boolean;
    getUserData?: (req: Request, res: Response) => any;
}
export declare const defaultConfig: AccessLogConfig;
export declare function mergeWithDefault(config: AccessLogConfig): AccessLogConfig;
