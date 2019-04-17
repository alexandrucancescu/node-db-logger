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
    private static computeEntryResponse;
    private computeEntryRequest;
    /**
     * Sends a access log entry to all the transports in a async manner,
     * so they don't wait after each other
     * @param entry
     */
    private sendToTransports;
    private static validateTransports;
}
