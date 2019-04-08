// import {SkipRule, StatusCodeRule} from "../config/Types";
// import {cleanUrl, wildcardNumberMatch} from "../util/Generic";
//
// export default class SkipMinder{
// 	private readonly skipRules:SkipRule[];
//
// 	constructor(skipRules: SkipRule[]) {
// 		this.skipRules = skipRules;
// 		this.cleanRulesUrls();
// 	}
//
// 	public shouldSkip(path:string,res:Express.Response):{stdout:boolean;main:boolean}{
// 		if(!Array.isArray(this.skipRules) || this.skipRules.length<1){
// 			return {stdout:false,main:false};
// 		}
// 		const matchingRules=this.getMatchingRulesFor(path);
//
// 		if(matchingRules.length<1) return {stdout:false,main:false};
//
// 		let skipStdout=false;
// 		let shouldSkip=false;
//
// 		for(let rule of matchingRules){
// 			let ruleBroken=false;
// 			const ifs=rule.if;
//
// 			if(!ifs){
// 				shouldSkip=true;
// 			}else{
//
// 			}
//
// 			if(shouldSkip===true && rule.skipStout){
// 				skipStdout=true;
// 			}
// 			//No reason to continue. A rule was broken and stdout is skipped too
// 			//Else we continue. Maybe there is a rule to skip stdout also
// 			if(shouldSkip && skipStdout){
// 				return {stdout:true,main:true};
// 			}
// 		}
//
// 	}
//
// 	private static statusCodeMatch(code:number, rule:StatusCodeRule){
// 		if(typeof rule==="number"){
// 			return code===rule;
// 		}else if(typeof rule==="string"){
// 			return wildcardNumberMatch(code,rule);
// 		}else if(Array.isArray(rule) && rule.length>0){
// 			for(let currentRule of rule){
// 				if(typeof currentRule==="number" && currentRule===code ){
// 					return true;
// 				}else if(typeof currentRule==="string" && wildcardNumberMatch(code,currentRule)){
// 					return true;
// 				}
// 			}
// 		}
// 		return false;
// 	}
//
// 	private getMatchingRulesFor(path:string){
// 		return this.skipRules.filter(rule=>{
// 			if(typeof rule.path==="string"){
// 				return rule.path===path;
// 			}else if(rule.path instanceof RegExp){
// 				return rule.path.test(path);
// 			}
// 			return false;
// 		});
// 	}
//
// 	private cleanRulesUrls(){
// 		if(Array.isArray(this.skipRules)){
// 			this.skipRules.forEach(rule=>{
// 				if(typeof rule.path==="string"){
// 					rule.path=cleanUrl(rule.path)
// 				}
// 			});
// 		}
// 	}
// }