import {Schema,Document} from "mongoose"

export interface IInstance extends Document{
	location:string;
	ip:string;
	name:string;
}

const InstanceSchema=new Schema({

},);