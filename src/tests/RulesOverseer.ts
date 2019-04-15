import {describe,it} from "mocha"
import {expect} from "chai"
import RulesOverseer from "../lib/helper/RulesOverseer";
import {Request,Response} from "express"

describe("Rules Overseer",()=>{
	it("should return the correct act based on path rules",returnsCorrectActPathRules);
	it("should return the merged act from multiple rules",returnsMergedActFromRules);
	it("should correctly pass if no conditionals",passesWhenNoConditionals);
	it("should correctly resolve the status code conditional",resolvesStatusCodeConditional);
	it("should correctly resolve the contentType conditional",resolvesContentTypeConditional);
	it("should correctly resolve the custom test conditional",resolvesTheTestConditional);
	it("should correctly resolve the requestUnfulfilled conditional",resolvesRequestUnfulfilledConditional);
	it("should correctly resolve multiple conditionals until one is true or none are",resolvesMultipleConditionals)
});

function returnsCorrectActPathRules(){
	const response={headersSent:true} as Response;

	const overseer=new RulesOverseer([
		{path:"/**",do:{skip:true}},
		{path:"/company",do:{skip:false}},
		{path:"/company/user",do:{skip:true}},
		{path:"/company/user/admin",do:{skip:false,set:{request:{userData:true}}}},
	]);

	expect(overseer.computeRouteAct(<Request>{url:"/index"},response))
		.to.deep.equal({skip:true});

	expect(overseer.computeRouteAct(<Request>{url:"/company"},response))
		.to.deep.equal({skip:false});

	expect(overseer.computeRouteAct(<Request>{url:"/company/user"},response))
		.to.deep.equal({skip:true});

	expect(overseer.computeRouteAct(<Request>{url:"/company/user/admin"},response))
		.to.deep.equal({skip:false,set:{request:{userData:true}}});

}

function returnsMergedActFromRules(){
	const response={headersSent:true} as Response;

	const overseer=new RulesOverseer([
		{path:"/**",do:{skip:true}},
		{path:"/company/**",do:{set:{request:{headers:["user-agent"]}}}},
		{path:"/company/user",do:{skip:false,set:{response:{body:true}}}},
		{path:"/company/user/admin",do:{skip:false,set:{request:{userData:true}}}},
	]);

	expect(overseer.computeRouteAct({url:"/company/user"} as Request,response))
		.to.deep.equal({
			skip:false,
			set:{
				request:{
					headers:["user-agent"]
				},
				response:{
					body:true
				},
			}
		});

	expect(overseer.computeRouteAct({url:"/company/user/admin"} as Request,response))
		.to.deep.equal({
		skip:false,
		set:{
			request:{
				headers:["user-agent"],
				userData:true,
			},
		}
	});

	expect(overseer.computeRouteAct({url:"/about"} as Request,response))
		.to.deep.equal({
		skip:true,
	});
}

function passesWhenNoConditionals(){

	const request_index = {url:"/index"} as Request;

	expect(overseer_1.computeRouteAct(request_index,res_json_409))
		.to.deep.equal({skip:false,set:{request:{query:true}}});

}

function resolvesStatusCodeConditional(){

	const request_company={url:"/company"} as Request;

	expect(overseer_1.computeRouteAct(request_company,res_json_409).skip)
		.to.be.true;

	expect(overseer_1.computeRouteAct(request_company,res_json_200))
		.to.deep.equal({skip:false,set:{request:{query:true}}});
}

function resolvesContentTypeConditional(){
	const req_company_ceo=mockRequest({path:"/company/ceo"});

	let response=expect(overseer_1.computeRouteAct(req_company_ceo,res_json_200))
		.to.haveOwnProperty("set")
		.that.has.ownProperty("response");

	response.has.ownProperty("headers").which.deep.equals(["content-type"]);
	response.has.ownProperty("body").which.is.true;

	expect(overseer_1.computeRouteAct(req_company_ceo,res_xml_200))
		.to.haveOwnProperty("skip").which.is.true;

	const actHtml=overseer_1.computeRouteAct(req_company_ceo,res_html_500);

	expect(actHtml).to.haveOwnProperty("skip").which.is.true;
	expect(actHtml).to.not.haveOwnProperty("response");

}

function resolvesTheTestConditional(){
	const request_test_false=mockRequest({path:"/about_us/",headers:{referer:"google.com"}});
	const request_test_true=mockRequest({path:"/about_us/",headers:{referer:"bing.com"}});

	expect(overseer_1.computeRouteAct(request_test_false,res_json_200))
		.to.have.haveOwnProperty("set")
		.that.has.ownProperty("request")
		.that.does.not.have.ownProperty("userData");

	expect(overseer_1.computeRouteAct(request_test_true,res_json_200))
		.to.haveOwnProperty("set")
		.that.has.ownProperty("request")
		.that.has.ownProperty("userData")
		.that.is.true;
}

function resolvesRequestUnfulfilledConditional() {
	const req_api_users=mockRequest({path:"/api/users"});

	expect(overseer_1.computeRouteAct(req_api_users,res_json_200))
		.to.haveOwnProperty("skip")
		.that.is.true;

	expect(overseer_1.computeRouteAct(req_api_users,res_unfulfilled))
		.to.haveOwnProperty("skip")
		.that.is.false;
}

function resolvesMultipleConditionals(){
	const overseer=new RulesOverseer([
		{
			path:"/**",
			do:{skip:false}
		},
		{
			path:"/api/users",
			do:{
				skip:true,
			},
			if:{
				statusCode:["5**",404],
				contentType:"application/*",
				requestUnfulfilled:true
			}
		},
		{
			path:"/api/posts",
			do:{
				set:{
					request:{userData:true}
				},
			},
			if:{
				statusCode:"4**",
				test():boolean{
					return true;
				}
			}
		}
	]);

	//USERS API

	const req_api_users=mockRequest({path:"/api/users"});

	expect(overseer.computeRouteAct(req_api_users,res_unfulfilled))
		.to.haveOwnProperty("skip").that.is.true;

	expect(overseer.computeRouteAct(req_api_users,res_html_500))
		.to.haveOwnProperty("skip").that.is.true;

	expect(overseer.computeRouteAct(req_api_users,res_html_200))
		.to.haveOwnProperty("skip").that.equals(false);

	//POSTS API

	const req_api_posts=mockRequest({path:"/api/posts"});

	expect(overseer.computeRouteAct(req_api_posts,res_unfulfilled))
		.to.have.ownProperty("set");

}

//MOCK DATA & GENERATORS

//Overseers mock

const overseer_1=new RulesOverseer([
	{
		path: "/**",
		do: {
			skip: false,
			set: {
				request: {
					query: true
				}
			}
		},
	},
	{
		path:"/company",
		do:{
			skip:true,
		},
		if:{
			statusCode:["4**","5**"]
		}
	},
	{
		path:"/company/ceo",
		do:{
			set:{
				response:{
					headers:["content-type"],
					body:true
				}
			}
		},
		if:{
			contentType:"application/*"
		}
	},
	{
		path:"/company/ceo",
		do:{
			skip:true
		},
		if:{
			contentType:["text/html","*/xml"]
		}
	},
	{
		path:"/about_us",
		do:{
			set:{
				request:{
					userData:true
				}
			}
		},
		if:{
			test(req:Request,res:Response):boolean{
				return req.headers.referer!=="google.com"
			}
		}
	},
	{
		path:"/api/**",
		do:{
			skip:true
		}
	},
	{
		path:"/api/users",
		do:{
			skip:false,
		},
		if:{
			requestUnfulfilled:true,
		}
	},
]);

const overseer_2=new RulesOverseer([
	{
		path: "/**",
		do: {
			skip: false,
			set: {
				request: {
					query: true
				}
			}
		},
	},
	{
		path:"/company",
		do:{
			skip:true,
		},
		if:{
			statusCode:["4**","5**"]
		}
	},
	{
		path:"/company/ceo",
		do:{
			set:{
				response:{
					headers:["content-type"]
				}
			}
		},
		if:{
			contentType:"application/*"
		}
	},
	{
		path:"/about_us",
		do:{
			set:{
				request:{
					userData:true
				}
			}
		},
		if:{
			test(req:Request,res:Response):boolean{
				return req.headers.referer!=="google.com"
			}
		}
	},
	{
		path:"/api/**",
		do:{
			skip:true
		}
	},
	{
		path:"/api/users",
		do:{
			skip:false,
		},
		if:{
			requestUnfulfilled:true,
		}
	},
]);

//Responses

const res_json_409=mockResponse({headersSent:true,statusCode:409,headers:{'content-type':"application/json"}});
const res_json_200=mockResponse({headersSent:true,statusCode:200,headers:{'content-type':"application/json"}});
const res_html_200=mockResponse({headersSent:true,statusCode:200,headers:{'content-type':"text/html"}});
const res_html_500=mockResponse({headersSent:true,statusCode:500,headers:{'content-type':"text/html"}});
const res_xml_200=mockResponse({headersSent:true,statusCode:200,headers:{'content-type':"application/xml"}});
const res_unfulfilled=mockResponse({headersSent:false});

//Response generator

function mockRequest(req:{path:string,headers?:{[s:string]:string}}):Request{
	return {
		url:req.path,
		originalUrl:req.path,
		baseUrl:req.path,
		get(h:string){
			if(req.headers && req.headers[h]){
				return req.headers[h]
			}
			return undefined;
		},
		headers:req.headers
	} as Request;
}

function mockResponse(res:{headersSent?:boolean,statusCode?:number,headers?:{[s:string]:string}}):Response{
	return {
		headersSent:res.headersSent===true,
		statusCode:res.statusCode,
		getHeader(h:string){
			if(res.headers && res.headers[h]){
				return res.headers[h]
			}
			return undefined;
		}
	} as Response;
}
