import PublicRouteRule, {Path} from "../domain/access-log/RouteRule";
import debug from "../util/DebugLog";
import {cleanUrl, deleteProp, getProp} from "../util/Generic";
import * as isGlob from "is-glob"
import {makeRe as globToRegex} from "micromatch"

type RouteRule=PublicRouteRule&{
	_originalPath?:Path
}

/**
 * Removes rules with invalid paths
 * Cleans urls
 * Converts glob pattern paths to regex paths
 * Removes invalid properties from rules
 *
 *
 * @param rules = rules passed to the constructor
 * @returns the valid rules
 */
export default function normalizeRules(rules:RouteRule[]):RouteRule[]{
	if(!Array.isArray(rules)){
		return [];
	}

	let currentRulePriority=0;

	return rules.filter(rule=>{
		if(typeof rule!=="object" || rule===null){
			return false;
		}

		if(!isPathValid(rule.path)){
			return false;
		}

		//Save the original path for debugging purposes
		rule._originalPath=rule.path;

		if(typeof rule.path==="string"){
			if(isGlob(rule.path)){
				rule.path=globToRegex(rule.path);
			}else{
				rule.path=cleanUrl(rule.path);
			}
		}

		normalizeConditionals(rule);
		normalizeAct(rule);

		//Rule has no worth as it does not describe an action to do
		if(rule.do===undefined){
			return false;
		}

		if(typeof rule.priority!=="number" || isNaN(rule.priority)){
			if(rule.priority!==undefined || (typeof rule.priority==="number" && isNaN(rule.priority)) ){
				typeMismatchDebug(rule,"priority","number",rule.priority);
			}
			currentRulePriority+=0.001;
			rule.priority=currentRulePriority;
		}

		return true;
	});
}

function isPathValid(path:Path):boolean{
	if(typeof path==="string") {
		if (path.length < 1) {
			debug.error(`Path ${path} is invalid`);
			return false;
		}
	}else if(!(path instanceof RegExp)){
		debug.error(`Path ${path} should be either string or RegExp`);
		return false;
	}
	return true;
}

//Wrap function to prevent error throw and to ensure the type returned is boolean
function wrapBooleanFunction(func:(...any)=>boolean):()=>boolean{
	return function(...any:any[]):boolean{
		try{
			return func(...any)===true;
		}catch (e) {
			debug.error("RouterRule if.test function threw error:",e);
			return false;
		}
	}
}

function normalizeConditionals(rule:RouteRule){
	if(ensureObject(rule,"if")){

		//Ensure if.test is a function and if it is wrap it in a safe call
		if(rule.if.test!==undefined){
			if(typeof rule.if.test!=="function"){
				typeMismatchDebug(rule,"if.test","function",rule.if.test);
				delete rule.if.test;
			}else{
				//Wrap test function to prevent error throw
				rule.if.test=wrapBooleanFunction(rule.if.test);
			}
		}

		//Ensures if.requestUnfulfilled is a boolean or deletes it
		if(rule.if.requestUnfulfilled!==undefined){
			if(typeof rule.if.requestUnfulfilled!=="boolean"){
				typeMismatchDebug(rule,"if.requestUnfulfilled","boolean",rule.if.requestUnfulfilled);
				delete rule.if.requestUnfulfilled;
			}
		}

		//Validates if.contentType rule/rules.
		//Keeps only string entries that have a length>0
		if(rule.if.contentType!==undefined){
			if(Array.isArray(rule.if.contentType)){
				rule.if.contentType=rule.if.contentType.filter(ct=>typeof ct==="string" && ct.length>0);

				if(rule.if.contentType.length<1){
					//Delete if no rules left after filtering
					delete rule.if.contentType;
				}
			}else if(typeof rule.if.contentType!=="string"){
				typeMismatchDebug(rule,"if.contentType","string || string[]",rule.if.contentType);
				delete rule.if.contentType
			}else if(rule.if.contentType.length<1){
				delete rule.if.contentType;
			}
		}

		//Validates if.statusCode rule/rules
		//Makes sure to only keep wildcard string or numbers that can represent http status codes
		if(rule.if.statusCode!==undefined){
			if(Array.isArray(rule.if.statusCode)){
				rule.if.statusCode=rule.if.statusCode.filter(sc=>{
					return (typeof sc==="string" && sc.length===3)||
						(typeof sc==="number" && sc>99 && sc<600);
				});
				if(rule.if.statusCode.length<1){
					delete rule.if.statusCode;
				}
			}else if(typeof rule.if.statusCode==="string"){
				if(rule.if.statusCode.length!==3){
					debug.error(`On rule with path '${rule._originalPath}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
					delete rule.if.statusCode;
				}
			}else if(typeof rule.if.statusCode==="number"){
				//Delete if not a valid http status code
				if(rule.if.statusCode<100 || rule.if.statusCode >=600){
					debug.error(`On rule with path '${rule._originalPath}', property 'if.statusCode', invalid status code ${rule.if.statusCode}`);
					delete rule.if.statusCode;
				}
			}else{
				typeMismatchDebug(rule,"if.statusCode","string || number || string[] || number[]",typeof rule.if.statusCode);
			}
		}

		const hasAnyCondition=[
			rule.if.statusCode,
			rule.if.contentType,
			rule.if.contentType,
			rule.if.test,
			rule.if.requestUnfulfilled
		].some(c=>c!==undefined);

		//If it does not have any condition delete it altogether
		if(!hasAnyCondition){
			delete rule.if;
		}
	}
}

function normalizeAct(rule:RouteRule){
	if(ensureObject(rule,"do")){

		//Skip prop normalization
		if(rule.do.skip!==undefined){
			//Ensure it is a boolean
			rule.do.skip=(rule.do.skip===true);
		}

		if(ensureObject(rule,"do.set")){

			const set=rule.do.set;

			if(ensureObject(rule,"do.set.request")){

				ensureBoolean(rule,"do.set.request.userData");
				ensureBoolean(rule,"do.set.request.query");
				ensureBoolean(rule,"do.set.request.body");

				if(set.request.headers!==undefined){
					if(Array.isArray(set.request.headers)){
						set.request.headers=set.request.headers.filter(h=>
							typeof h==="string" && h.length>0
						);
						if(set.request.headers.length<1){
							delete set.request.headers;
						}
					}else if(typeof set.request.headers!=="boolean"){
						typeMismatchDebug(rule,"rule.do.set.request.headers","array",set.request.headers);
						delete set.request.headers;
					}
				}
			}

			if(ensureObject(rule,"do.set.response")){

				ensureBoolean(rule,"do.set.response.body");

				if(set.response.headers!==undefined){
					if(Array.isArray(set.response.headers)){
						set.response.headers=set.response.headers.filter(h=>
							typeof h==="string" && h.length>0
						);
						if(set.response.headers.length<1){
							delete set.response.headers;
						}
					}else if(typeof set.response.headers!=="boolean"){
						typeMismatchDebug(rule,"rule.do.set.response.headers","array",set.response.headers);
						delete set.response.headers;
					}
				}
			}
		}
	}
}
/**
 * @summary Checks if key of rule represents a boolean.
 * 			If not, the property gets deleted from the rule
 * @param rule The rule whose key is checked
 * @param key Can represent a nested key, like 'do.set.request.headers'
 */
function ensureBoolean(rule:RouteRule,key:string){
	const val=getProp(rule,key);
	if(val!==undefined && typeof val!=="boolean"){
		typeMismatchDebug(rule,key,"boolean",val);
		deleteProp(rule,key);
	}
}

/**
 * @summary Checks if key of rule represents an object that is not null.
 * 			If not, the property gets deleted from the rule
 * @param rule The rule whose key is checked
 * @param key Can represent a nested key, like 'do.set.request.headers'
 * @return true if the value of key of is an object
 */
function ensureObject(rule:RouteRule,key:string):boolean{
	const val=getProp(rule,key);

	if(typeof val!=="object" || val===null){
		//If undefined no need to log it or delete it
		if(val!==undefined){
			typeMismatchDebug(rule,key,"object",val);
			deleteProp(rule,key);
		}
		return false;
	}else{
		return true;
	}
}

function typeMismatchDebug(rule:RouteRule,property:string,shouldBe:string,is:any){
	debug.error(`On rule with .path='${rule._originalPath}'. Property .${property} should be of type ${shouldBe}, instead is a ${typeof is} with value='${is}'`);
}