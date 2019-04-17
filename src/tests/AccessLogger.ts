import {describe,it,before,after,afterEach} from "mocha";
import * as chai from "chai"
import * as SinonChai from "sinon-chai"
import {match,spy,assert} from "sinon"
import * as mockApp from "./mock/ExpressServer"
import * as request from "phin"
import AccessLogger from "../lib/logger/AccessLogger"
import RouteRule from "../lib/domain/access-log/RouteRule";

const expect=chai.expect;

chai.use(SinonChai);

const PORT=29876;
const HOST="127.0.0.1";
const URL=`http://${HOST}:${PORT}`;

const USER_DATA={name:"Paul",age:30,privilege:"admin"};

describe("AccessLogger",()=>{

	describe("Exceptions",()=>{
		it("should throw if transports are invalid",throwsInvalidTransports);
		it("should throw if rules are not valid",throwsInvalidRules);
		it("should throw if config or config parameters are invalid",throwsInvalidConfig);
	});

	describe("Transport calls",()=>{
		before(createMockApp);
		afterEach(()=>transport.transport.resetHistory());

		it("should skip request if skip:true and not call transport",skipsRequest);
		it("should skip request if act is null and not call transport",skipsRequestActNull);

		it("should send to the transport the correct http method, remote ip, path and response code",sendsCorrectInfo);
		it("should send transport request info and query parameters",sendsQuery);
		it("should send transport user-agent header and user data",sendsUaAndUserData);
		it("should send transport the request body and all request headers",sendsBodyAndAllHeaders);
		it("should send transport tht response headers",sendsResponseHeaders);

		after(mockApp.stop);
	});
});

async function sendsQuery(){
	const PATH='/test_query';

	await request({
		method:"GET",
		url:`${URL}${PATH}?x=1&y=2`,
	});

	expect(transport.transport).to.have.been.calledWith({
		request: {
			method: "GET",
			path: PATH,
			remote_address: HOST,
			query:{
				x:"1",
				y:"2",
			}
		},
		response: {
			code: 200,
			responseTime:match.number,
		}
	});
}

async function sendsUaAndUserData(){
	const PATH="/test_ua_user_data";

	await request({
		method:"GET",
		url:`${URL}${PATH}?x=1`,
		headers:{
			'user-agent':'JamesBond/1.3 Gecko/0.9'
		}
	});

	expect(transport.transport).to.have.been.calledWith(
		{
			request: {
				method: "GET",
				path: PATH,
				remote_address: HOST,
				userData: USER_DATA,
				headers:{
					'user-agent':'JamesBond/1.3 Gecko/0.9'
				}
			},
			response: {
				code: 200,
				responseTime:match.number,
			}
		}
	)


}

async function sendsBodyAndAllHeaders(){
	const PATH="/test_req_body_headers";
	const METHOD="POST";
	const HEADERS={
		'user-agent':'JamesBond/1.3 Gecko/0.9',
		'content-type':'application/json',
	};
	const DATA={score:10,for:['n','o','d','e']};

	await request({
		method:METHOD,
		url:`${URL}${PATH}`,
		headers:HEADERS,
		data:DATA
	});

	expect(transport.transport).to.have.been.calledWith(
		{
			request: {
				method: METHOD,
				path: PATH,
				remote_address: HOST,
				headers:match.has('user-agent').and(match.has('content-type')).and(match.has('host')),
				body: DATA,
			},
			response: {
				code: 200,
				responseTime:match.number,
			}
		}
	)
}

async function sendsResponseHeaders(){
	const PATH="/test_res_headers";
	const METHOD="GET";

	await request({
		method:METHOD,
		url:`${URL}${PATH}`,
	});

	expect(transport.transport).to.have.been.calledWith(
		{
			request: {
				method: METHOD,
				path: PATH,
				remote_address: HOST,
			},
			response: {
				code: 200,
				responseTime:match.number,
				headers:match.has("pragma","no-cache")
					.and(match.has("x-powered-by","nodejs"))
					.and(match.has("content-type",match(/application\/json.*/)))
					.and(match.has("content-length",match(/[0-9]*/)))
			}
		}
	);
}

async function sendsCorrectInfo(){
	const PATH="/test_info";
	const METHOD="MKACTIVITY";

	await request({
		method:METHOD,
		url:`${URL}${PATH}`,
	});

	expect(transport.transport).to.have.been.calledWith(
		{
			request: {
				method: METHOD,
				path: PATH,
				remote_address: HOST,
			},
			response: {
				code: 309,
				responseTime:match.number,
			}
		}
	)


}

async function skipsRequest(){
	await request({
		method:"GET",
		url:`${URL}/test_skip`
	});

	expect(transport.transport).to.have.not.been.called;
}

async function skipsRequestActNull() {
	await request({
		method:"GET",
		url:`${URL}/test_skip2`
	});

	expect(transport.transport).to.have.not.been.called;
}

function throwsInvalidRules(){
	expect(()=>{
		new AccessLogger([],null)
	}).to.throw;

	expect(()=>{
		new AccessLogger([],[{} as any])
	}).to.throw;
}

function throwsInvalidConfig(){
	expect(()=>{
		new AccessLogger([],[],null);
	}).to.throw;

	expect(()=>{
		new AccessLogger([],[],{removeTrailingSlash:false,getUserData:true as any});
	}).to.throw;

	expect(()=>{
		new AccessLogger([],[],{removeTrailingSlash:88 as any});
	}).to.throw;
}

function throwsInvalidTransports(){
	expect(()=>{
		new AccessLogger(null as any,[]);
	}).to.throw;

	expect(()=>{
		new AccessLogger([{} as any],[],null);
	}).to.throw;

	expect(()=>{
		new AccessLogger([{transport:88 as any}],[],null);
	}).to.throw;
}



//MOCK Access Logger and express app

const rules:RouteRule[]=[
	{
		path:"/test_info",
		do:{
			skip:false,
		}
	},
	{
		path:"/test_query",
		do:{
			skip:false,
			set:{
				request:{
					query:true
				}
			}
		}
	},
	{
		path:"/test_skip",
		do:{
			skip:true,
		}
	},
	{
		path:"/test_ua_user_data",
		do:{
			set:{
				request: {
					userData: true,
					headers:["user-agent"]
				},
			}
		}
	},
	{
		path:"/test_body_headers",
		do:{
			set:{
				request:{
					body:true,
					headers:true,
				}
			}
		}
	},
	{
		path:"/test_res_headers",
		do:{
			set:{
				response:{
					headers:true,
				}
			}
		}
	}
];

const transport={transport:spy()};

const accessLogger=new AccessLogger(
	[transport],
	rules,
	{
		removeTrailingSlash:true,
		getUserData(){
			return USER_DATA;
		}
	}
);

async function createMockApp(){
	mockApp.mountMiddleware(accessLogger.express);
	mockApp.mountRoutes();
	await mockApp.start(PORT,HOST);
}