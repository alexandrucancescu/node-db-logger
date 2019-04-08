import SkipMinder from "../helper/SkipMinder";
import AccessLogEntry from "../domain/access-log/AcessLogEntry";

export default abstract class AccessLogTransport{
	private readonly skipMinder:SkipMinder;

	public constructor(skipMinder:SkipMinder){
		this.skipMinder=skipMinder;
	}

	protected abstract handleEntry(entry:AccessLogEntry);

	public transport(entry:AccessLogEntry){
		this.handleEntry(entry);
	}
}