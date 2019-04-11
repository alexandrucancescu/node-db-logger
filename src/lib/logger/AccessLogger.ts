import AccessLog, {IAccessLog} from "../model/AccessLog";
import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {getProcessTimeMs} from "../util/Generic";
import AccessLogTransport from "../transports/access_log/AccessLogTransport"
import {OutgoingHttpHeaders, ServerResponse} from "http";
import RulesOverseer from "../helper/RulesOverseer";
import RouteRule from "../domain/access-log/RouteRule";

export default class AccessLogger{
	private readonly transports:AccessLogTransport[];
	private readonly rulesOverseer:RulesOverseer;

	constructor(rules:RouteRule[]) {
		this.rulesOverseer=new RulesOverseer(rules);
	}

	public get express():RequestHandler{
		return this.requestHandler.bind(this);
	}

	private requestHandler(req:Request,res:Response,next:NextFunction){
		const start_ms=getProcessTimeMs();
		onRequestFinished(req,this.requestFinished.bind(this,req,res,start_ms));
		next();
	}

	private requestFinished(req:Request,res:Response,start_ms:number){
		const response_time_ms=getProcessTimeMs()-start_ms;
		const matchedPaths=this.rulesOverseer.computeRouteAct(req,res);
	}
}