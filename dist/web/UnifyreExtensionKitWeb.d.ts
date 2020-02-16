import { Container } from "ferrum-plumbing";
import { UnifyreExtensionKitClient } from "../client/UnifyreExtensionKitClient";
export declare class UnifyreExtensionKitWeb {
    private static _container;
    static initializeTest(appId: string): Promise<Container | undefined>;
    static initializeDev(appId: string): Promise<Container | undefined>;
    static initializeKudi(appId: string): Promise<Container | undefined>;
    static initializeUnifyre(appId: string): Promise<Container | undefined>;
    static initialize(appId: string, apiUrl: string): Promise<Container | undefined>;
    static client(): UnifyreExtensionKitClient;
}
//# sourceMappingURL=UnifyreExtensionKitWeb.d.ts.map