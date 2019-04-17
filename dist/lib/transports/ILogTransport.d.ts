export default interface ILogTransport<L> {
    transport(entry: L): void | Promise<void>;
}
