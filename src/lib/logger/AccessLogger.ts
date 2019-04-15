import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {getProcessTimeMs} from "../util/Generic";
import AccessLogTransport from "../transports/access_log/AccessLogTransport"
import RulesOverseer from "./rules/RulesOverseer";
import RouteRule from "../domain/access-log/RouteRule";
import {AccessLogConfig} from "../domain/access-log/AccessLogConfig";

export default class AccessLogger{
	public static debugLog:boolean=true;

	private readonly transports:AccessLogTransport[];
	private readonly rulesOverseer:RulesOverseer;
	private readonly config:AccessLogConfig;

	constructor(rules:RouteRule[]) {
		this.rulesOverseer=new RulesOverseer(rules,true);
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
		const act=this.rulesOverseer.computeRouteAct(req,res);
	}

}