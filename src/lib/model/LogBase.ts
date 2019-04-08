import {Schema,Document} from "mongoose";

const Types=Schema.Types;

export interface ILogBase extends Document{
	time:Date;
	instance:string;
	expiresAt:Date;
}

const LogBaseSchema={
	time:{
		type:Types.Date,
		required:true,
		default:Date.now,
	},
	expiresAt:{
		type:Types.Date,
		required:true,
	},
	instance:{
		type:Types.ObjectId,
		required:true,
		index:true,
	},
};

export default LogBaseSchema;