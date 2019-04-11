// import RouteRule from "./RouteRule";
//
// export type Path=string|RegExp;
//
// export type StatusCodeRule=number|string|Array<number|string>;
// export type ContentTypeRule=string|string[];
//
// export interface ConditionalRule{
// 	statusCode?:StatusCodeRule;
// 	contentType?:ContentTypeRule;
// 	test?:()=>boolean;
// }
//
// class Dont{
// 	private parent: MakeRule;
//
// 	constructor(parent:MakeRule){
// 		this.parent=parent;
// 	}
//
// 	get setRequestHeaders():MakeRule{
// 		return this.parent.setRequestHeaders(null);
// 	}
//
// 	get setResponseHeaders():MakeRule{
// 		return this.parent.setResponseHeaders(null);
// 	}
// }
//
// class MakeRule{
// 	public routeRule:RouteRule;
//
// 	constructor(path:string|RegExp){
// 		this.routeRule={path};
// 	}
//
// 	public if(condition:ConditionalRule):MakeRule{
// 		this.routeRule.if=condition;
// 		return this;
// 	}
//
// 	public get dont():Dont{
// 		return new Dont(this);
// 	}
//
// 	public get skip():MakeRule{
// 		this.routeRule.skip=true;
// 		return this;
// 	}
//
// 	public static onPath(path:string|RegExp):MakeRule{
// 		return new MakeRule(path);
// 	}
//
// 	public setResponseHeaders(headers:string[]):MakeRule{
// 		if(!this.routeRule.set){
// 			this.routeRule.set={};
// 		}
// 		this.routeRule.set.response.headers=headers;
// 		return this;
// 	}
//
// 	public setRequestHeaders(headers:string[]):MakeRule{
// 		if(!this.routeRule.set){
// 			this.routeRule.set={};
// 		}
// 		this.routeRule.set.response.headers=headers;
// 		return this;
// 	}
//
// 	public get and():MakeRule{
// 		return this;
// 	}
// }
//
//
// MakeRule.onPath("/**").if({statusCode:"5**"}).and.if({})
// 	.dont.setRequestHeaders.and.dont.setResponseHeaders;
//# sourceMappingURL=RuleBuilder.js.map