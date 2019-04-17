import IAccessLogTransport from "../AccessLogTransport";
import AccessLogEntry from "../../../domain/access-log/AccessLogEntry";
export default class MongoTransport implements IAccessLogTransport {
    transport(entry: AccessLogEntry): Promise<any>;
}
