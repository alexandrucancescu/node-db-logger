/// <reference types="mongoose" />
import { ILogBase } from "./LogBase";
export interface IAccessLog extends ILogBase {
    ip: string;
    method: string;
    path: string;
    query: {
        [key: string]: string | string[];
    };
    responseCode?: number;
    responseTime?: number;
    headers: {
        [key: string]: string;
    };
    userData?: any;
    error?: any;
}
declare const _default: import("mongoose").Model<IAccessLog, {}>;
export default _default;
