import { Container, Module } from "ferrum-plumbing";
/**
 * Initializes a client module. The app that uses this module must register two types:
 * JsonStorage, and LoggerFactory. Plus it should pass in apiUrl, and appId
 */
export declare class ClientModule implements Module {
    private apiUrl;
    private appId;
    constructor(apiUrl: string, appId: string);
    configAsync(c: Container): Promise<void>;
}
//# sourceMappingURL=ClientModule.d.ts.map