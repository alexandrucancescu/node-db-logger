import RulesOverseer from "../../logger/rules/RulesOverseer";
import AccessLogEntry from "../../domain/access-log/AccessLogEntry";

export interface IAccessLogTransport{
	transport(entry:AccessLogEntry):void;
}

export default abstract class AccessLogTransport implements IAccessLogTransport{
	private readonly rulesOverseer:RulesOverseer;

	constructor(rulesOverseer: RulesOverseer) {
		if(new.target===AccessLogTransport){
			throw new TypeError("Class AccessLogTransport is an abstract class and must be extended in order to create a transport");
		}
		if(typeof this.handleEntry!=="function"){
			throw new TypeError(`Class ${(this as any).constructor.name} does not implement the required method 'handleEntry'`);
		}
		this.rulesOverseer = rulesOverseer;
	}

	protected abstract handleEntry(entry:AccessLogEntry);

	public transport(entry:AccessLogEntry){
		this.handleEntry(entry);
	}
}