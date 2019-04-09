import AccessLogTransport from "./AccessLogTransport";
import AccessLogEntry from "../../domain/access-log/AcessLogEntry";
export default class ConsoleAccessLog extends AccessLogTransport {
    private static formatResponseTime;
    private static format;
    protected handleEntry(entry: AccessLogEntry): void;
}
