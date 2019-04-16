import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {cleanIp, cleanUrl, getProcessTimeMs} from "../util/Generic";
import {IAccessLogTransport} from "../transports/access_log/AccessLogTransport"
import RulesOverseer from "./rules/RulesOverseer";
import RouteRule from "../domain/access-log/RouteRule";
import {AccessLogConfig, mergeWithDefault} from "../domain/access-log/AccessLogConfig";
import AccessLogEntry from "../domain/access-log/AccessLogEntry";
import {access as debug} from "../util/DebugLog"

export default class AccessLogger{
	public static debugLog:boolean=true;

	private readonly transports:IAccessLogTransport[];
	private readonly rulesOverseer:RulesOverseer;
	private readonly config:AccessLogConfig;

	constructor(transports:IAccessLogTransport[],rules:RouteRule[],config?:AccessLogConfig) {
		AccessLogger.validateTransports(transports);

		this.transports=transports;
		this.config=mergeWithDefault(config);
		this.rulesOverseer=new RulesOverseer(rules,this.config.removeTrailingSlash);
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

		const path=cleanUrl(req.originalUrl||req.url,this.config.removeTrailingSlash);


		const entry:AccessLogEntry={
			request:{
				method:req.method.toUpperCase(),
				path,
				remote_address:cleanIp(req.connection.remoteAddress),
			},
			response:{
				responseTime:response_time_ms,
				code: res.headersSent ? res.statusCode : undefined
			}
		};

		if(act.set){
			if(act.set.request){
				if(act.set.request.query==true && req.query){
					entry.request.query=req.query;
				}
				if(act.set.request.body===true && req.body!==undefined){
					entry.request.body=req.body;
				}
				if(act.set.request.headers){
					if(act.set.request.headers===true){
						entry.request.headers=req.headers;
					}else if(Array.isArray(act.set.request.headers)){
						entry.request.headers={};
						for(let headerKey of act.set.request.headers){
							if(req.headers[headerKey]!==undefined){
								entry.request.headers[headerKey]=req.headers[headerKey];
							}
						}
					}
				}
				if(act.set.request.userData===true){
					if(this.config.getUserData===undefined){
						debug.error(`For route ${path}, rule has set.request.userData=true but the getUserData function has not been defined`);
					}else{
						try{
							entry.request.userData=this.config.getUserData(req,res);
						}catch (e) {
							debug.error(`getUserData function threw error: ${e.toString()}`)
						}
					}
				}
			}
		}

		this.sendToTransports(entry);

	}

	/**
	 * Sends a access log entry to all the transports in a async manner,
	 * so they don't wait after each other
	 * @param entry
	 */
	private sendToTransports(entry:AccessLogEntry){
		for(let transport of this.transports){
			(async ()=>{
				try{
					const sent=transport.transport(entry);
					if(sent instanceof Promise){
						await sent;
					}
				}catch (ignored) {}
			})().catch();
		}
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