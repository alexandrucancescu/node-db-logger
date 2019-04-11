export type Path=RegExp|string;

export type StatusCodeRule=number|string|Array<number|string>;
export type ContentTypeRule=string|string[];

export interface ConditionalRule{
	statusCode?:StatusCodeRule;
	contentType?:ContentTypeRule;
	requestUnfulfilled?:boolean;
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

export interface Act{
	skip?:boolean;
	set?:SetRule;
}

export default interface RouteRule{
	path:Path;
	if?:ConditionalRule;
	priority?:number;
	do:Act,
}