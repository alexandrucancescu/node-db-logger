import AccessLogger from "../logger/AccessLogger";

export const access={
	log(...args){
		if(AccessLogger.debugLog===true){
			console.log(...args);
		}
	},
	error(...args){
		if(AccessLogger.debugLog===true){
			console.log(...args);
		}
	}
};