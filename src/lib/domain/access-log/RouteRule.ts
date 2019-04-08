export type Path=string|RegExp;
export type StatusCodeRule=number|number[]|string|string[];
export type ContentTypeRule=string|string[];

export interface ConditionalRule{
	statusCode?:StatusCodeRule;
	contentTypeRule?:ContentTypeRule;
	test?:()=>boolean;
}

export interface SetRule{
	request?:{
		headers?:boolean|string[];
		body?:boolean;
		query?:boolean;
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