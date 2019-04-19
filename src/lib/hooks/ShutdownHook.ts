import {wrapPromise} from "../util/Generic";

type ShutdownHandlers=()=>void|Promise<void>;

export default class ShutdownHook{
	private static handlers:ShutdownHandlers[]=[];
	private static isMounted=false;

	private static mount(){
		if(this.isMounted) return;
		process.on("beforeExit",this.onShutdown.bind(this));
		this.isMounted=true;
	}

	private static async onShutdown(){
		console.log("beforeExit");
		const promises=[];
		while(this.handlers.length>0){
			const handler=this.handlers.shift();
			try{
				const promise=handler();
				if(promise instanceof Promise){
					promises.push(wrapPromise(promise));
				}
			}catch (e) {}
		}
		await Promise.all(promises);
	}
}