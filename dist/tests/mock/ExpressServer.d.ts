import { RequestHandler } from "express";
export declare function mountMiddleware(middleware: RequestHandler): void;
export declare function mountRoutes(): void;
export declare function start(port?: number, ip?: string): Promise<void>;
export declare function stop(): Promise<void>;
