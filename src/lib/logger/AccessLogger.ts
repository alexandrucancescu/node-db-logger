import AccessLog, {IAccessLog} from "../model/AccessLog";
import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {cleanUrl, getProcessTimeMs} from "../util/Generic";
import AccessLogTransport from "../transports/access_log/AccessLogTransport"

export default class AccessLogger{
	private readonly instanceId:string;
	private readonly transports:AccessLogTransport[];

	constructor(instanceId:string) {
		this.instanceId=instanceId;
	}


	public middleware():RequestHandler{
		return this.requestHandler.bind(this);
	}

	private async requestHandler(req:Request,res:Response,next:NextFunction){
		const start_ms=getProcessTimeMs();

		onRequestFinished(req,(error:any)=>{
			const end_ms=getProcessTimeMs();

			const logEntry=new AccessLog();
			logEntry.method=req.method.toUpperCase();
			logEntry.time=new Date();
			logEntry.responseTime=Math.floor(end_ms-start_ms);
			logEntry.instance=this.instanceId;
			logEntry.path=cleanUrl(req.baseUrl);
			console.log(res.statusCode,res.get("content-type"));
		});
		next();
	}
}