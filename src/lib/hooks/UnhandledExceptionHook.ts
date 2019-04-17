
type ExceptionObserver=(err:Error)=>void|Promise<void>;

export default class UnhandledExceptionHook{
	private static observers:ExceptionObserver[]=[];
	private static isMounted=false;
	private static exitAfter=true;

	public static mount(exitAfter:boolean=true){
		if(this.isMounted) return;
		this.exitAfter=exitAfter;
		process.on("uncaughtException",this.onException.bind(this));
		this.isMounted=true;
	}

	private static async onException(error:Error){
		const promises=[];
		while(this.observers.length>0){
			const handler=this.observers.shift();
			try{
				const promise=handler(error);
				if(promise instanceof Promise){
					promises.push(this.wrapPromise(promise));
				}
			}catch (e) {}
		}
		if(promises.length>0){
			await Promise.all(promises);
		}

		if(this.exitAfter){
			process.exit(1);
		}
	}

	private static wrapPromise<T>(promise:Promise<T>):Promise<T>{
		return new Promise<T>(resolve => {
			promise.then(resolve).catch(resolve);
		})
	}

	public static addObserver(observer:ExceptionObserver){
		if(this.observers.indexOf(observer)>-1) return;
		this.observers.push(observer);
	}
}