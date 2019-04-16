import RulesOverseer from "../../logger/rules/RulesOverseer";
import AccessLogEntry from "../../domain/access-log/AccessLogEntry";
export interface IAccessLogTransport {
    transport(entry: AccessLogEntry): void;
}
export default abstract class AccessLogTransport implements IAccessLogTransport {
    private readonly rulesOverseer;
    constructor(rulesOverseer: RulesOverseer);
    protected abstract handleEntry(entry: AccessLogEntry): any;
    transport(entry: AccessLogEntry): void;
}
