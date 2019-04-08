import {Schema,model} from "mongoose";
import LogBaseSchema,{ILogBase} from "./LogBase";

const Types=Schema.Types;

export interface IAccessLog extends ILogBase{
	ip:string;
	method:string;
	path:string;
	query:{[key:string]:string|string[]};
	responseCode?:number;
	responseTime?:number;
	headers:{[key:string]:string};
	userData?:any;
	error?:any;
}

const AccessLogSchema=new Schema({
	...LogBaseSchema,
	responseCode:{
		type:Types.Number,
	},
	responseTime:{
		type:Types.Number,
	},
	ip:{
		type:Types.String,
		required:true
	},
	method:{
		type:Types.String,
		required:true
	},
	path:{
		type:Types.String,
		required:true,
	},
	query:{
		type:Types.Mixed,
	},
	headers:{
		type:Types.Mixed,
	},
	userData:{
		type:Types.Mixed,
	},
	error:{
		type:Types.Mixed,
	}
},{writeConcern:{w:0,j:false}});

export default model<IAccessLog>('Log', AccessLogSchema);