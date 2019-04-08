import { RequestHandler } from "express";
import { AccessLogConfig } from "../config/Types";
export default class AccessLogger {
    private readonly instanceId;
    private readonly config;
    private readonly skipMinder;
    constructor(instanceId: string, config: AccessLogConfig);
    middleware(): RequestHandler;
    private requestHandler;
}
