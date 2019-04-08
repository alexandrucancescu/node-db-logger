export declare type Path = string | RegExp;
export declare type StatusCodeRule = number | string | Array<number | string>;
export declare type ContentTypeRule = string | string[];
export interface ConditionalRule {
    statusCode?: StatusCodeRule;
    contentType?: ContentTypeRule;
    test?: () => boolean;
}
export interface SetRule {
    request?: {
        headers?: boolean | string[];
        body?: boolean;
        query?: boolean;
    };
    response?: {
        body?: boolean;
        headers?: boolean | string[];
    };
}
export default interface RouteRule {
    path: Path;
    if?: ConditionalRule;
    set?: SetRule;
    priority?: number;
    skip?: boolean;
}
