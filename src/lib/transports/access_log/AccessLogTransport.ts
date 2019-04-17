import AccessLogEntry from "../../domain/access-log/AccessLogEntry";
import ILogTransport from "../ILogTransport";

export default interface IAccessLogTransport extends ILogTransport<AccessLogEntry>{}
