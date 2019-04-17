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
	host?:string;
	port?:string;
	user:string;
	pass?:string;
	database?:string;
	connectionString?:string;
}

export default interface TransportConfig{
	connection:DatabaseConnection,
	structure:StructureConfig,
	keepLogsFor?:string;
	stackBeforeStoring?:boolean;
	stackSize?:boolean;
	fallback:TransportFallback
}

export enum TransportFallback{
	FILE,
	MEMORY
}