export type Path=string|RegExp;

export type StatusCodeRule=number|string|Array<number|string>;
export type ContentTypeRule=string|string[];

export interface ConditionalRule{
	statusCode?:StatusCodeRule;
	contentType?:ContentTypeRule;
	test?:()=>boolean;
}

export interface SetRule{
	request?:{
		headers?:boolean|string[];
		body?:boolean;
		query?:boolean;
		userData?:boolean;
	},
	response?:{
		body?:boolean;
		headers?:boolean|string[];
	}
}

export default interface RouteRule{
	path:Path;
	if?:ConditionalRule;
	set?:SetRule;
	priority?:number;
	skip?:boolean;
}

export interface Act{
	skip:boolean;
	set:SetRule;
}