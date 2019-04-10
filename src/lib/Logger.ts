import RouteRule from "./domain/access-log/RouteRule";

export default class Logger{
	public static configuration={
		debug:true,
		defaultRouteRoute:{
			path:"/**",
			do:{
				set:{
					request:{
						query:true,
						userData:true,
						body:false,
						headers:["user-agent"]
					},
					response:{
						body:false,
						headers:false,
					},
				},
			},
			priority:-1
		} as RouteRule,
	}
}