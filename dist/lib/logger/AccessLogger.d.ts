import { RequestHandler } from "express";
export default class AccessLogger {
    private readonly transports;
    constructor();
    expressMiddleware(): RequestHandler;
    private requestHandler;
    private requestFinished;
}
