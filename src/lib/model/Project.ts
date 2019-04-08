import {Schema,Document} from "mongoose"

export interface IProject extends Document{
	name:string;
	uuid:string;
	log_levels:{
		[key:string]:number;
	};
}

const InstanceSchema=new Schema({

},);