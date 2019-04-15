import { RequestHandler } from "express";
import RouteRule from "../domain/access-log/RouteRule";
export default class AccessLogger {
    static debugLog: boolean;
    private readonly transports;
    private readonly rulesOverseer;
    private readonly config;
    constructor(rules: RouteRule[]);
    readonly express: RequestHandler;
    private requestHandler;
    private requestFinished;
}
