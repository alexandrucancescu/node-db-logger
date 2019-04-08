import SkipMinder from "../helper/SkipMinder";
import AccessLogEntry from "../domain/access-log/AcessLogEntry";
export default abstract class AccessLogTransport {
    private readonly skipMinder;
    constructor(skipMinder: SkipMinder);
    protected abstract handleEntry(entry: AccessLogEntry): any;
    transport(entry: AccessLogEntry): void;
}
