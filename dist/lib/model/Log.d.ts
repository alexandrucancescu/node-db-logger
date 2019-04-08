/// <reference types="mongoose" />
import { ILogBase } from "./LogBase";
export interface ILog extends ILogBase {
    level: number;
    occurrences: Date[];
}
declare const _default: import("mongoose").Model<ILog, {}>;
export default _default;
