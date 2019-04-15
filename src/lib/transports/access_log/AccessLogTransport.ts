import RulesOverseer from "../../logger/rules/RulesOverseer";
import AccessLogEntry from "../../domain/access-log/AccessLogEntry";

export default abstract class AccessLogTransport{
	private readonly rulesOverseer:RulesOverseer;

	constructor(rulesOverseer: RulesOverseer) {
		this.rulesOverseer = rulesOverseer;
	}

	protected abstract handleEntry(entry:AccessLogEntry);

	public transport(entry:AccessLogEntry){
		this.handleEntry(entry);
	}
}