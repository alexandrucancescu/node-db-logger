import {RequestHandler,Request,Response,NextFunction} from "express"
import * as onRequestFinished from "on-finished";
import {getProcessTimeMs} from "../util/Generic";
import {cleanIp, cleanUrl} from "../util/Parsing";
import {IAccessLogTransport} from "../transports/access_log/AccessLogTransport"
import RulesOverseer from "./rules/RulesOverseer";
import RouteRule, {Act} from "../domain/access-log/RouteRule";
import {AccessLogConfig, mergeWithDefault} from "../domain/access-log/AccessLogConfig";
import AccessLogEntry, {AccessLogEntryRequest, AccessLogEntryResponse} from "../domain/access-log/AccessLogEntry";
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

		const entry:AccessLogEntry={
			request:this.computeEntryRequest(act,req,res),
			response:AccessLogger.computeEntryResponse(act,response_time_ms,req,res)
		};

		this.sendToTransports(entry);

	}

	private static computeEntryResponse(act:Act, res_time_ms:number, ignored_req:Request, res:Response):AccessLogEntryResponse{
		const entryResponse:AccessLogEntryResponse={
			responseTime:res_time_ms,
			code: res.headersSent ? res.statusCode : null
		};

		if(act.set && act.set.response){
			if(act.set.response.headers){
				if(act.set.response.headers===true){
					if(!res.headersSent){
						entryResponse.headers=null;
					}else{
						entryResponse.headers=res.getHeaders();
					}
				}else if(Array.isArray(act.set.response.headers)){
					entryResponse.headers={};
					const sentHeaders=res.getHeaders();
					for(let header of act.set.response.headers){
						if(sentHeaders.hasOwnProperty(header)){
							entryResponse.headers[header]=sentHeaders[header];
						}
					}
				}
			}
			//not supported yet as it needs to mount a write interceptor on the response
			//which can significantly affect performance
			// if(act.set.response.body===true){
			//
			// }
		}

		return entryResponse;
	}

	private computeEntryRequest(act:Act,req:Request,res:Response):AccessLogEntryRequest{

		const path=cleanUrl(req.originalUrl||req.url,this.config.removeTrailingSlash);

		const entryRequest:AccessLogEntryRequest={
			method:req.method.toUpperCase(),
			path,
			remote_address:cleanIp(req.connection.remoteAddress)
		};

		if(act.set && act.set.request){
			if(act.set.request.query==true && req.query){
				entryRequest.query=req.query;
			}
			if(act.set.request.body===true && req.body!==undefined){
				entryRequest.body=req.body;
			}
			if(act.set.request.headers){
				if(act.set.request.headers===true){
					entryRequest.headers=req.headers;
				}else if(Array.isArray(act.set.request.headers)){
					entryRequest.headers={};
					for(let header of act.set.request.headers){
						if(req.headers.hasOwnProperty(header)){
							entryRequest.headers[header]=req.headers[header];
						}
					}
				}
			}
			if(act.set.request.userData===true){
				if(!this.config.hasOwnProperty("getUserData")){
					debug.error(`For route ${path}, rule has set.request.userData=true but the getUserData function has not been defined`);
				}else{
					try{
						entryRequest.userData=this.config.getUserData(req,res);
					}catch (e) {
						debug.error(`getUserData function threw error: ${e.toString()}`)
					}
				}
			}
		}

		return entryRequest;
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