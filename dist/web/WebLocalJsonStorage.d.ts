import { JsonStorage } from "ferrum-plumbing/dist/serviceTypes/Storage";
export declare class WebLocalJsonStorage implements JsonStorage {
    load(key: string): Promise<any>;
    remove(key: string): Promise<void>;
    save(key: string, val: any): Promise<void>;
}
//# sourceMappingURL=WebLocalJsonStorage.d.ts.map