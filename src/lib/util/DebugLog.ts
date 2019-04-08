import Logger from "../Logger";

function log(...args){
	if (Logger.configuration.debug) {
		console.log(...args);
	}
}

function error(...args){
	if (Logger.configuration.debug) {
		console.error(...args);
	}
}


export default {log,error};