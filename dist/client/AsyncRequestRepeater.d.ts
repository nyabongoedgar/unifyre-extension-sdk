import { Injectable } from "ferrum-plumbing";
export declare const ASYNC_API_REFRESH_TIMEOUT = 3000;
export declare const ASYNC_API_REQUEST_TIMEOUT: number;
export declare class TimeoutError extends Error {
}
export declare class AsyncRequestRepeater implements Injectable {
    private isShutDown;
    private timeOutHandle;
    private lastRequestId;
    private requests;
    constructor();
    __name__(): string;
    registerPromise<T>(action: (requestId: number) => Promise<T>, timeout?: number): Promise<T>;
    registerRequest(handler: (id: number) => Promise<any>, onSuccess: (res: any | undefined) => void, onError: (e: Error) => void, onTimeout: () => void, timeout?: number): void;
    onRefresh(): Promise<void>;
    shutDown(): void;
    initialize(): void;
}
//# sourceMappingURL=AsyncRequestRepeater.d.ts.map