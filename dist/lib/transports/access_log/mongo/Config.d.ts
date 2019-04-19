export interface StructureConfig {
    projectName: string;
    serviceName?: string;
    instance?: {
        autoDiscover?: boolean;
        ip?: string;
        region?: string;
        id?: string | number;
        description?: string;
    };
}
export interface DatabaseConnection {
    user?: string;
    pass?: string;
    database?: string;
    connectionString: string;
}
export interface TransportConfig {
    connection: DatabaseConnection;
    structure: StructureConfig;
    keepLogsFor?: string | number;
    stackBeforeStoring?: boolean;
    stackSize?: number;
    fallback?: TransportFallback;
}
export declare enum TransportFallback {
    FILE = 0,
    MEMORY = 1
}
export default function parseConfig(config: TransportConfig): TransportConfig;
