import { IAccessLogTransport } from "./AccessLogTransport";
import AccessLogEntry from "../../domain/access-log/AccessLogEntry";
export default class ConsoleAccessLog implements IAccessLogTransport {
    private static formatResponseTime;
    private static format;
    transport(entry: AccessLogEntry): void;
}
