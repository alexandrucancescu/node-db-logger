import {Schema,model} from "mongoose";
import LogBaseSchema, {ILogBase} from "./LogBase";

const Types=Schema.Types;

export interface ILog extends ILogBase{
	level:number;
	occurrences:Date[];
}


const LogSchema=new Schema({
	...LogBaseSchema,
	level:{
		type:Types.Number,
		required:true,
	},
	occurrences: {
		required:false,
		type:[Types.Date],
	},
	message:{
		required:true,
		type:Types.String,
	},

},{writeConcern:{w:0,j:false}});

export default model<ILog>('Log', LogSchema);