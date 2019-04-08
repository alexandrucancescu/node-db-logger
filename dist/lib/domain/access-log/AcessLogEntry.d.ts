import LogEntryBase from "../LogEntryBase";
export interface AccessLogEntryRequest {
    remote_address: string;
    headers?: {
        [key: string]: string;
    };
    method: string;
    path: string;
    query?: {
        [key: string]: string | string[];
    };
    userData?: any;
}
export interface AccessLogEntryResponse {
    code?: number;
    responseTime: number;
    error?: any;
    headers?: {
        [key: string]: string;
    };
    body?: any;
}
export default interface AccessLogEntry extends LogEntryBase {
    request: AccessLogEntryRequest;
    response: AccessLogEntryResponse;
}
