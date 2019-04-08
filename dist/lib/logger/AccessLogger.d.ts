import { RequestHandler } from "express";
export default class AccessLogger {
    private readonly instanceId;
    private readonly transports;
    constructor(instanceId: string);
    middleware(): RequestHandler;
    private requestHandler;
}
