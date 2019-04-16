import * as merge from "lodash.merge"
import {Request,Response} from "express"

export interface AccessLogConfig {
	removeTrailingSlash:boolean;
	getUserData?:(req:Request,res:Response)=>any;
}

export const defaultConfig:AccessLogConfig={
	removeTrailingSlash:true,
};

export function mergeWithDefault(config:AccessLogConfig):AccessLogConfig{
	if(config===undefined){
		return defaultConfig;
	}

	if(typeof config!=="object" || config===null){
		throw new TypeError("Parameter 'config' should be a non null object");
	}

	if(config.removeTrailingSlash!==undefined && typeof config.removeTrailingSlash!=="boolean"){
		throw new TypeError("Config property removeTrailingSlash must be a boolean");
	}

	if(config.getUserData!==undefined && typeof config.getUserData!=="function"){
		throw new TypeError("Config property getUserData should be a function");
	}


	return merge({},defaultConfig,config);
}