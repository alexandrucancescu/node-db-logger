
/*
	Tests a mime-type against a generic, wildcard pattern
 */
export function mimeMatch(target:string,pattern:string):boolean{
	if(typeof target!=="string" || target.length<1){
		return false;
	}
	if(typeof pattern!=="string" || target.length<1){
		return false;
	}
	target=target.split(";").shift().replace(/ /g,"");

	const [patternRoot,patternSub]=pattern.split("/");
	const [targetRoot,targetSub]=target.split("/");

	if(patternRoot==="*"){
		if(typeof targetRoot!=="string" || targetRoot.length<1){
			return false;
		}
	}else if(patternRoot!==targetRoot){
		return false;
	}

	if(patternSub==="*"){
		if(typeof targetSub!=="string" || targetSub.length<1){
			return false;
		}
	}else if(patternSub!==targetSub){
		return false;
	}
	
	return true;

}


/*
	Returns the process time in ms
 */
export function getProcessTimeMs():number{
	const [sec,nano]=process.hrtime();
	return (sec*1000)+(nano/Math.pow(10,6));
}

/*
	Cleans URL paths from trailing slashes and query parameters
	Expects input URL to be valid
 */
export function cleanUrl(url:string):string{
	let cleaning=url;
	if(cleaning.length>1){
		//Remove query parameters
		if(cleaning.indexOf("?")>-1){
			cleaning=cleaning.split("?").shift();
		}

		//Remove trailing slash
		cleaning=cleaning.replace(/\/$/,"");
	}else if(cleaning.length<1){
		cleaning="/";
	}
	return cleaning;
}

/*
	Checks numbers against a wildcard template. Use '*' for any digit
	(n:404,template:'4**') => true
	(n:401,template:'4*1') => false

	Only works with integers >= 0
 */
export function wildcardNumberMatch(n:number, template:string){
	if(n<0) return false;
	const strNr=n.toString();
	if(strNr.length!==template.length){
		return false;
	}
	for(let i=0;i<template.length;i++){
		const char=template.charAt(i);
		if(char!=="*" && char!==strNr.charAt(i)){
			return false;
		}
	}
	return true;
}