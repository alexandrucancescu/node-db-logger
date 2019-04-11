import RouteRule, {StatusCodeRule} from "../domain/access-log/RouteRule";
import {cleanUrl, wildcardNumberMatch} from "../util/Generic";
import normalizeRules from "./RulesNormalize";
import {Request,Response} from "express"
import * as merge from "lodash.merge"

export default class RulesOverseer{
	private readonly rules:RouteRule[];

	constructor(rules:RouteRule[]){
		this.rules=normalizeRules(rules);
	}

	public computeRouteAct(req:Request,res:Response){
		const path=cleanUrl(req.originalUrl||req.url);
		console.log("URL",path,"code",res.statusCode,"mime",res.get("content-type"));
		const matchedRules=this.getRulesMatched(path,req,res);
		console.log(matchedRules.map((r:any)=>r._originalPath));
		// console.log(matchedRules);
		const mergedAct=merge(...matchedRules.map(r=>r.do));
		console.log(mergedAct);
	}

	private getRulesMatched(path:string,req:Request,res:Response):RouteRule[]{
		return this.rules.filter(rule=>{
			if(!pathMatches(path,rule)){
				return false;
			}
			if(rule.if){
				return conditionsSatisfied(res,rule);
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
function conditionsSatisfied(res:Response,rule:RouteRule):boolean{
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
		return conditions.test()===true;
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