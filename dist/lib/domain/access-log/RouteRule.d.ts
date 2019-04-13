/// <reference types="node" />
/// <reference types="express-serve-static-core" />
import { IncomingMessage, ServerResponse } from "http";
export declare type Path = RegExp | string;
export declare type StatusCodeRule = number | string | Array<number | string>;
export declare type ContentTypeRule = string | string[];
declare type Request = IncomingMessage | Express.Request;
declare type Response = ServerResponse | Express.Response;
export interface ConditionalRule {
    statusCode?: StatusCodeRule;
    contentType?: ContentTypeRule;
    requestUnfulfilled?: boolean;
    test?: (req: Request, res: Response) => boolean;
}
export interface SetRule {
    request?: {
        headers?: boolean | string[];
        body?: boolean;
        query?: boolean;
        userData?: boolean;
    };
    response?: {
        body?: boolean;
        headers?: boolean | string[];
    };
}
export interface Act {
    skip?: boolean;
    set?: SetRule;
}
export default interface RouteRule {
    path: Path;
    if?: ConditionalRule;
    priority?: number;
    do: Act;
}
export {};
