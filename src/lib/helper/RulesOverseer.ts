import RouteRule, {Act, StatusCodeRule} from "../domain/access-log/RouteRule";
import {cleanUrl, wildcardNumberMatch} from "../util/Generic";
import normalizeRules from "./RulesNormalize";
import {Request,Response} from "express"
import * as mergeWith from "lodash.mergewith"

export default class RulesOverseer{
	private readonly rules:RouteRule[];

	constructor(rules:RouteRule[]){
		this.rules=normalizeRules(rules);
	}

	public computeRouteAct(req:Request,res:Response):Act{
		const path=cleanUrl(req.originalUrl||req.url);
		const matchedRules=this.getRulesMatched(path,req,res).sort(priorityCompare);

		const acts=matchedRules.map(rule=>rule.do);

		let mergedAct=null;

		if(acts.length===1){
			mergedAct=acts[0];
		}else{
			mergedAct=mergeWith(...acts,(obj,src)=>Array.isArray(src) ? src : undefined);
		}

		return mergedAct;
	}

	private getRulesMatched(path:string,req:Request,res:Response):RouteRule[]{
		return this.rules.filter(rule=>{
			if(!pathMatches(path,rule)){
				return false;
			}
			if(rule.if){
				return conditionsSatisfied(req,res,rule);
			}else{
				//If there are no conditions to be satisfied return true
				return true;
			}
		});
	}
}

/**
 * Multiple conditions in a .if property are treated as 'or', so true is returned
 * when any of them are satisfied
 */
function conditionsSatisfied(req:Request,res:Response,rule:RouteRule):boolean{
	const conditions=rule.if;

	if(res.headersSent){
		if(conditions.statusCode){
			if(statusCodeRuleMatches(res.statusCode,conditions.statusCode)){
				return true;
			}
		}
		if(conditions.contentType){

		}
	}
	if(conditions.requestUnfulfilled && !res.headersSent){
		return true;
	}

	if(conditions.test){
		return conditions.test(req,res)===true;
	}

	return false;
}

/**
 * @return true if the status code matches the StatusCodeRule
 */
function statusCodeRuleMatches(code:number,codeRule:StatusCodeRule):boolean{
	if(code===undefined) return false;
	if(Array.isArray(codeRule)){
		return codeRule.some(statusCodeAtomMatches.bind(null,code));//If one of the rules matches
	}
	return statusCodeAtomMatches(code,codeRule);
}

/**
 * Tests a single atom of a StatusCodeRule
 */
function statusCodeAtomMatches(code:number,ruleAtom:string|number):boolean{
	if(typeof ruleAtom==="number"){
		return ruleAtom===code;
	}else if(typeof ruleAtom==="string"){
		return wildcardNumberMatch(code,ruleAtom);
	}
	return false;
}

function pathMatches(path:string,rule:RouteRule):boolean{
	if(typeof rule.path==="string"){
		return rule.path===path;
	}else if(rule.path instanceof RegExp){
		return rule.path.test(path);
	}
	return false;
}

/**
 * Compares two RouteRules based on their priority
 * Utility function for array sorting
 */
function priorityCompare(a:RouteRule,b:RouteRule){
	return a.priority-b.priority;
}