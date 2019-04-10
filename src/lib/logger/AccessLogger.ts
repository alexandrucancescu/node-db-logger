import AccessLog, {IAccessLog} from "../model/AccessLog";
import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {getProcessTimeMs} from "../util/Generic";
import AccessLogTransport from "../transports/access_log/AccessLogTransport"

export default class AccessLogger{
	private readonly transports:AccessLogTransport[];

	constructor() {
	}


	public expressMiddleware():RequestHandler{
		return this.requestHandler.bind(this);
	}

	private requestHandler(req:Request,res:Response,next:NextFunction){
		const start_ms=getProcessTimeMs();

		onRequestFinished(req,this.requestFinished.bind(this,req,res,start_ms));
		next();
	}

	private requestFinished(req:Request,res:Response,start_ms:number){
		const response_time_ms=getProcessTimeMs()-start_ms;

	}
}