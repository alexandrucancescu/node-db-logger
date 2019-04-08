/// <reference types="express-serve-static-core" />
export declare type Path = string | RegExp;
export declare type StatusCodeRule = number | number[] | string | string[];
export declare type ContentTypeRule = string | string[];
export declare type ShouldSkipFunction = (req: Express.Request, res: Express.Response) => boolean;
export declare type SkipRule = {
    path: Path;
    if?: {
        statusCode?: StatusCodeRule;
        contentType?: ContentTypeRule;
        shouldSkip?: ShouldSkipFunction;
    };
    skipStout?: boolean;
};
export interface AccessLogTransportConfig {
    skipRules?: SkipRule[];
}
export declare type AccessLogConfig = {
    toStdout: boolean;
    skipRules?: SkipRule[];
    parseUserData?: (req: Express.Request) => any;
};
