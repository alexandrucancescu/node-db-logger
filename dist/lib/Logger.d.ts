import RouteRule from "./domain/access-log/RouteRule";
export default class Logger {
    static configuration: {
        debug: boolean;
        defaultRouteRoute: RouteRule;
    };
}
