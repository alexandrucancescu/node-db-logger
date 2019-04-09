import RulesOverseer from "../../helper/RulesOverseer";
import AccessLogEntry from "../../domain/access-log/AcessLogEntry";
export default abstract class AccessLogTransport {
    private readonly rulesOverseer;
    constructor(rulesOverseer: RulesOverseer);
    protected abstract handleEntry(entry: AccessLogEntry): any;
    transport(entry: AccessLogEntry): void;
}
