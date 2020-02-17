import { Container } from "ferrum-plumbing";
import { UnifyreExtensionKitClient } from "../client/UnifyreExtensionKitClient";
export declare class UnifyreExtensionKitWeb {
    private static _container;
    static initializeTest(appId: string): Promise<Container>;
    static initializeDev(appId: string): Promise<Container>;
    static initializeKudi(appId: string): Promise<Container>;
    static initializeUnifyre(appId: string): Promise<Container>;
    static initialize(appId: string, apiUrl: string): Promise<Container>;
    static client(): UnifyreExtensionKitClient;
}
//# sourceMappingURL=UnifyreExtensionKitWeb.d.ts.map