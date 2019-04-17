export interface AccessLogEntryRequest {
    remote_address: string;
    headers?: {
        [header: string]: string | string[];
    };
    method: string;
    path: string;
    query?: {
        [key: string]: string | string[];
    };
    body?: any;
    userData?: any;
}
export interface AccessLogEntryResponse extends Object {
    code?: number;
    responseTime: number;
    error?: any;
    headers?: {
        [header: string]: string | string[] | number;
    };
    body?: any;
}
export default interface AccessLogEntry {
    request: AccessLogEntryRequest;
    response: AccessLogEntryResponse;
}
