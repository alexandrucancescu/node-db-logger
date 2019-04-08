export type Path=string|RegExp;
export type StatusCodeRule=number|number[]|string|string[];
export type ContentTypeRule=string|string[];
export type ShouldSkipFunction=(req:Express.Request,res:Express.Response)=>boolean;

export type SkipRule={
	path:Path,
	if?:{
		statusCode?:StatusCodeRule;
		contentType?:ContentTypeRule;
		shouldSkip?:ShouldSkipFunction;
	}
	skipStout?:boolean
}

export interface AccessLogTransportConfig{
	skipRules?:SkipRule[];
}


export type AccessLogConfig={
	toStdout:boolean;
	skipRules?:SkipRule[];
	parseUserData?:(req:Express.Request)=>any;
}