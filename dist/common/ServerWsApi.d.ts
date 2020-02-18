import { Injectable, LoggerFactory } from "ferrum-plumbing";
import { WebSocketMessage } from "./model/WebSocketMessage";
export interface WsEventPublisher {
    pubWsEvent(msg: WebSocketMessage): void;
}
export declare class ServerWsApi implements Injectable {
    private baseUri;
    private publisher;
    private socket;
    private lastToken;
    private lastPong;
    private log;
    private interval;
    constructor(baseUri: string, publisher: WsEventPublisher, logFac: LoggerFactory);
    __name__(): string;
    init(authToken: string): Promise<void>;
    state(): 'OPEN' | 'CONNECTING' | 'CLOSED' | 'CLOSING' | 'UNKNOWN' | undefined;
    private reconnect;
    private onOpen;
    private onMessage;
    private onClose;
    private onError;
    private ping;
}
//# sourceMappingURL=ServerWsApi.d.ts.map