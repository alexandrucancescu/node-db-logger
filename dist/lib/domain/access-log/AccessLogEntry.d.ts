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
    body?: any;
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
export default interface AccessLogEntry {
    request: AccessLogEntryRequest;
    response: AccessLogEntryResponse;
}
