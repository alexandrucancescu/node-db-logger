import {IAccessLogTransport} from "./AccessLogTransport";
import AccessLogEntry from "../../domain/access-log/AccessLogEntry";

export default class ConsoleAccessLog implements IAccessLogTransport{

	private static formatResponseTime(time_ms:number):string{
		if(time_ms<1000){
			return `${time_ms.toFixed(3)} ms`;
		}else{
			return `${(time_ms/1000).toFixed(3)} s`
		}
	}

	private static format(entry:AccessLogEntry):string{
		const responseTime=ConsoleAccessLog.formatResponseTime(entry.response.responseTime);

		const code=entry.response.code;
		const color=code >= 500 ? 31 // red
			: code >= 400 ? 33 // yellow
				: code >= 300 ? 36 // cyan
					: code >= 200 ? 32 // green
						: 0;

		return `${entry.request.method} ${entry.request.path} \x1b[${color}m${entry.response.code}\x1b[0m ${responseTime}\n`
	}

	public transport(entry: AccessLogEntry) {
		console.log(ConsoleAccessLog.format(entry))
	}
}