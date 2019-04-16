import * as express from "express"
import * as bodyParser from "body-parser"
import {Server,createServer} from "http";
import {RequestHandler} from "express";

const app=express();

app.use([
	bodyParser.json(),
	bodyParser.text(),
	bodyParser.urlencoded({extended:true,})
]);


let server=createServer(app);

export function mountMiddleware(middleware:RequestHandler){
	app.use(middleware);
}

export function mountRoutes(){
	const emptyResponseRoutes=[
		"/test_query",
		"/test_skip",
		"/test_skip_2",
		"/test_ua_user_data",
		"/test_body_headers",
	];

	app.use(emptyResponseRoutes,(ignored_req,res,ignored_next)=>res.sendStatus(200).end());

	app.mkactivity("/test_info",(ignored_req,res,ignored_next)=>res.sendStatus(309).end());
}

export async function start(port:number=29876,ip:string="127.0.0.1"){
	return new Promise<void>((resolve, reject) => {
		server.on("listening",resolve)
			.on("error",(err)=>{
				console.error(err);
				reject(err);
			})
			.listen(port,ip);
	});
}

export async function stop(){
	return new Promise<void>((resolve, reject) => {
		server.close(err=>{
			if(err){
				console.error(err);
				reject(err);
			}else{
				resolve();
			}
		});
	})
}

