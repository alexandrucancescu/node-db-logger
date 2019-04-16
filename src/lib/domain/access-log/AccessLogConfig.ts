import * as merge from "lodash.merge"

export interface AccessLogConfig {
	removeTrailingSlash:boolean;
}

export const defaultConfig:AccessLogConfig={
	removeTrailingSlash:true,

};

export function mergeWithDefault(config:AccessLogConfig):AccessLogConfig{
	if(!config){
		return defaultConfig;
	}

	if(typeof config!=="object"){
		throw new TypeError("Parameter 'config' should be an object");
	}

	if(config.removeTrailingSlash!==undefined && typeof config.removeTrailingSlash!=="boolean"){
		throw new TypeError("Config property removeTrailingSlash must be a boolean");
	}


	return merge({},defaultConfig,config);
}