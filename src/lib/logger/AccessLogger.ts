import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {cleanIp, cleanUrl, getProcessTimeMs} from "../util/Generic";
import AccessLogTransport, {IAccessLogTransport} from "../transports/access_log/AccessLogTransport"
import RulesOverseer from "./rules/RulesOverseer";
import RouteRule from "../domain/access-log/RouteRule";
import {AccessLogConfig, mergeWithDefault} from "../domain/access-log/AccessLogConfig";
import AccessLogEntry from "../domain/access-log/AccessLogEntry";

export default class AccessLogger{
	public static debugLog:boolean=true;

	private readonly transports:IAccessLogTransport[];
	private readonly rulesOverseer:RulesOverseer;
	private readonly config:AccessLogConfig;

	constructor(transports:IAccessLogTransport[],rules:RouteRule[],config?:AccessLogConfig) {
		AccessLogger.validateTransports(transports);

		this.transports=transports;
		this.config=mergeWithDefault(config);
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

		if(!act || act.skip===true){
			return;
		}

		const entry:AccessLogEntry={
			request:{
				method:req.method.toUpperCase(),
				path:cleanUrl(req.url,this.config.removeTrailingSlash),
				remote_address:cleanIp(req.connection.remoteAddress),
			},
			response:{
				responseTime:response_time_ms,
			}
		};

		console.log(entry);
	}

	private static validateTransports(transports:IAccessLogTransport[]){
		if(!Array.isArray(transports)){
			throw new TypeError("Parameter 'transports' is not an array");
		}
		transports.forEach((tr,index)=>{
			if(typeof tr.transport !== "function"){
				throw new TypeError(`Transport ${tr} at transports[${index}] does not implement the method 'transport'`);
			}
		});
	}

}