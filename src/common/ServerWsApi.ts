import {Injectable, Logger, LoggerFactory, ValidationUtils} from "ferrum-plumbing";
import {WebSocketMessage} from "./model/WebSocketMessage";

const PING_PERIOD = 5000;

export interface WsEventPublisher {
  pubWsEvent(msg: WebSocketMessage): void;
}

export class ServerWsApi implements Injectable {
  private socket: any = undefined;
  private lastToken: string = '';
  private lastPong: number = 0;
  private log: Logger;
  private interval: any;
  constructor(private baseUri: string,
              private publisher: WsEventPublisher,
              logFac: LoggerFactory) {
    this.log = logFac.getLogger(ServerWsApi);
    this.state = this.state.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.ping = this.ping.bind(this);
  }
  __name__(): string { return 'ServerWsApi'; }

  async init(authToken: string) {
    ValidationUtils.isTrue(!!authToken, '"authToken" must be provided');
    if (['OPEN', 'CONNECTING'].indexOf(this.state() as any) >= 0) {
      if (authToken !== this.lastToken) {
        this.lastToken = authToken;
        this.socket.close(1000, 'Changing signing token');
      }
    } else { // already disconnected
      this.lastToken = authToken;
      this.reconnect();
      if (!this.interval) {
        this.interval = setInterval(this.ping, PING_PERIOD);
      }
    }
  }

  state(): 'OPEN' | 'CONNECTING' | 'CLOSED' | 'CLOSING' | undefined {
    if (!this.socket) { return; }
    return this.socket.readyState;
  }

  private reconnect() {
    if (this.socket) {
      try{this.socket.close();}catch (e) {}
      this.socket = null;
    }

    if (!this.lastToken) {
      this.log.info("Ignoring re-connect. No token found");
      return;
    }

    // @ts-ignore
    this.socket = new WebSocket(`${this.baseUri}?authorization=${this.lastToken}`);
    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this. onMessage;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
  }

  private onOpen(e: any) {
    // nothing
  }

  private onMessage(msg: any) {
    if (msg && msg.data) {
      if (msg === 'PONG') {
        this.lastPong = Date.now();
      } else {
        // Process the message
        try {
          const jMsg = JSON.parse(msg) as WebSocketMessage;
          if (!jMsg.type) {
            throw new Error("No type");
          }
          this.publisher.pubWsEvent(jMsg);
        } catch (e) {
          this.log.error('Bad message received: ', msg, e);
        }
      }
    }
  }

  private onClose(e: any) {
    // Try to reconnect.
    this.log.info('Connection closed', e.wasClean, 'code', e.code, 'reason', e.reason);
  }

  private onError(e: any) {
    // Try to reconnect.
    this.log.error('Connection error', e.message);
  }

  private ping() {
    if (this.state() === 'OPEN') {
      this.socket.send('PING');
    }
    if ( (Date.now() - this.lastPong) > PING_PERIOD * 3 ) {
      this.reconnect();
    }
  }
}