import { RequestHandler } from "express";
import { IAccessLogTransport } from "../transports/access_log/AccessLogTransport";
import RouteRule from "../domain/access-log/RouteRule";
import { AccessLogConfig } from "../domain/access-log/AccessLogConfig";
export default class AccessLogger {
    static debugLog: boolean;
    private readonly transports;
    private readonly rulesOverseer;
    private readonly config;
    constructor(transports: IAccessLogTransport[], rules: RouteRule[], config?: AccessLogConfig);
    readonly express: RequestHandler;
    private requestHandler;
    private requestFinished;
    private static validateTransports;
}
