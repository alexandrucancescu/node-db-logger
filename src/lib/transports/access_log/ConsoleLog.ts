import AccessLogTransport from "./AccessLogTransport";
import AccessLogEntry from "../../domain/access-log/AccessLogEntry";

export default class ConsoleAccessLog extends AccessLogTransport{

	private static formatResponseTime(time_ms:number):string{
		if(time_ms<1000){
			return `${time_ms.toFixed(2)} ms`;
		}else{
			return `${(time_ms/1000).toFixed(3)} sec`
		}
	}

	private static format(entry:AccessLogEntry):string{
		const responseTime=ConsoleAccessLog.formatResponseTime(entry.response.responseTime);
		return `${entry.request.method} ${entry.request.path} ${entry.response.code} ${responseTime}`
	}

	protected handleEntry(entry: AccessLogEntry) {
		console.log(ConsoleAccessLog.format(entry))
	}
}