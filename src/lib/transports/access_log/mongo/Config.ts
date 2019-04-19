import {struct} from "superstruct"
import {timeStringToMs} from "../../../util/Parsing";

export interface StructureConfig{
	projectName:string;
	serviceName?:string;
	instance?:{
		autoDiscover?:boolean;
		ip?:string;
		region?:string;
		id?:string|number;
		description?:string;
	}
}

export interface DatabaseConnection{
	user?:string;
	pass?:string;
	database?:string;
	connectionString:string;
}

export interface TransportConfig{
	connection:DatabaseConnection,
	structure:StructureConfig,
	keepLogsFor?:string|number;
	stackBeforeStoring?:boolean;
	stackSize?:number;
	fallback?:TransportFallback
}

export enum TransportFallback{
	FILE,
	MEMORY
}

const TransportConfigSchema=struct({
	connection:{
		user:"string?",
		pass:"string?",
		database:"string?",
		connectionString:"string"
	},
	structure:{
		projectName:"string",
		serviceName:"string?",
		instance: struct.optional({
			autoDiscover : "boolean?",
			ip : "string?",
			region : "string?",
			id : "string?",
			description : "string?",
		})
	},
	keepLogsFor:"string?",
	stackBeforeStoring:"boolean?",
	stackSize:"number?",
},{
	structure:{
		serviceName:"__default",
		instance:{
			autoDiscover: false,
			id: "__dafault",
		}
	},
	keepLogsFor:"5d",
	stackBeforeStoring:false,
	stackSize:20,
});

export default function parseConfig(config:TransportConfig){
	const validated=TransportConfigSchema.assert(config) as TransportConfig;

	validated.keepLogsFor=timeStringToMs(validated.keepLogsFor as string);

	if(validated.keepLogsFor===null){
		throw TypeError(`${validated.keepLogsFor} is not a valid time representation`)
	}

	return validated;
}