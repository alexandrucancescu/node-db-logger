
type AnyObject={[s:string]:any};

export function deleteProp(of:AnyObject,prop:string):boolean{
	if(typeof prop!=="string" || typeof of!=="object" || of===null){
		return false;
	}

	const keys=prop.split(".");

	let parent=of;

	for(let i=0;i<keys.length;i++){
		const key=keys[i];
		if(parent.hasOwnProperty(key)){
			if(i===keys.length-1){
				delete parent[key];
				return true;
			}else{
				parent=parent[key];
			}
		}else{
			return false;
		}
	}
}

export function getProp(of:AnyObject,prop:string):any{
	if(typeof prop!=="string"){
		return undefined;
	}

	const keys=prop.split(".");

	let val=of;

	for(let key of keys){
		if(val.hasOwnProperty(key)){
			val=val[key];
		}else{
			return undefined;
		}
	}

	return val;
}

/**
 * @returns process time in ms
 */
export function getProcessTimeMs():number{
	const [sec,nano]=process.hrtime();
	return (sec*1000)+(nano/Math.pow(10,6));
}