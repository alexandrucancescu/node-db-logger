import RouteRule from "../domain/access-log/RouteRule";
import {cleanUrl} from "../util/Generic";
import debug from "../util/DebugLog"
import normalizeRules from "./RulesNormalize";
import {Request,Response} from "express"



export default class RulesOverseer{
	private readonly rules:RouteRule[];

	constructor(rules:RouteRule[]){
		this.rules=normalizeRules(rules);
	}

	public computeRouteAct(path:string,req:Request,res:Response){
		const rules=this.getRulesForPath(path);
	}

	private getRulesForPath(path:string):RouteRule[]{
		return this.rules.filter(rule=>{
			if(typeof rule.path==="string"){
				return rule.path===path;
			}else if(rule.path instanceof RegExp){
				return rule.path.test(path);
			}
			return false;
		});
	}
}