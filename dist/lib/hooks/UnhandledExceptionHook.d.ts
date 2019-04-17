declare type ExceptionObserver = (err: Error) => void | Promise<void>;
export default class UnhandledExceptionHook {
    private static observers;
    private static isMounted;
    private static exitAfter;
    static mount(exitAfter?: boolean): void;
    private static onException;
    private static wrapPromise;
    static addObserver(observer: ExceptionObserver): void;
}
export {};
