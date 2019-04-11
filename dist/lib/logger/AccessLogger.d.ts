import { RequestHandler } from "express";
import RouteRule from "../domain/access-log/RouteRule";
export default class AccessLogger {
    private readonly transports;
    private readonly rulesOverseer;
    constructor(rules: RouteRule[]);
    readonly express: RequestHandler;
    private requestHandler;
    private requestFinished;
}
