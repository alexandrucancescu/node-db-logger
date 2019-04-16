export interface AccessLogConfig {
    removeTrailingSlash: boolean;
}
export declare const defaultConfig: AccessLogConfig;
export declare function mergeWithDefault(config: AccessLogConfig): AccessLogConfig;
