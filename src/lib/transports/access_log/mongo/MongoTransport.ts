import IAccessLogTransport from "../AccessLogTransport";
import AccessLogEntry from "../../../domain/access-log/AccessLogEntry";


export default class MongoTransport implements IAccessLogTransport{


	async transport(entry: AccessLogEntry){
		return undefined;
	}

}

