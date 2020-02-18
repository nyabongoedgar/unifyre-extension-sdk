"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ferrum_plumbing_1 = require("ferrum-plumbing");
const PING_PERIOD = 5000;
class ServerWsApi {
    constructor(baseUri, publisher, logFac) {
        this.baseUri = baseUri;
        this.publisher = publisher;
        this.socket = undefined;
        this.lastToken = '';
        this.lastPong = 0;
        this.log = logFac.getLogger(ServerWsApi);
        this.state = this.state.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
        this.ping = this.ping.bind(this);
    }
    __name__() { return 'ServerWsApi'; }
    init(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            ferrum_plumbing_1.ValidationUtils.isTrue(!!authToken, '"authToken" must be provided');
            if (['OPEN', 'CONNECTING'].indexOf(this.state()) >= 0) {
                if (authToken !== this.lastToken) {
                    this.lastToken = authToken;
                    this.socket.close(1000, 'Changing signing token');
                }
            }
            else { // already disconnected
                this.lastToken = authToken;
                this.reconnect();
                if (!this.interval) {
                    this.interval = setInterval(this.ping, PING_PERIOD);
                }
            }
        });
    }
    state() {
        if (!this.socket) {
            return;
        }
        return this.socket.readyState;
    }
    reconnect() {
        if (this.socket) {
            try {
                this.socket.close();
            }
            catch (e) { }
            this.socket = null;
        }
        if (!this.lastToken) {
            this.log.info("Ignoring re-connect. No token found");
            return;
        }
        // @ts-ignore
        this.socket = new WebSocket(`${this.baseUri}?authorization=${this.lastToken}`);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    onOpen(e) {
        // nothing
    }
    onMessage(msg) {
        if (msg && msg.data) {
            if (msg === 'PONG') {
                this.lastPong = Date.now();
            }
            else {
                // Process the message
                try {
                    const jMsg = JSON.parse(msg);
                    if (!jMsg.type) {
                        throw new Error("No type");
                    }
                    this.publisher.pubWsEvent(jMsg);
                }
                catch (e) {
                    this.log.error('Bad message received: ', msg, e);
                }
            }
        }
    }
    onClose(e) {
        // Try to reconnect.
        this.log.info('Connection closed', e.wasClean, 'code', e.code, 'reason', e.reason);
    }
    onError(e) {
        // Try to reconnect.
        this.log.error('Connection error', e.message);
    }
    ping() {
        if (this.state() === 'OPEN') {
            this.socket.send('PING');
        }
        if ((Date.now() - this.lastPong) > PING_PERIOD * 3) {
            this.reconnect();
        }
    }
}
exports.ServerWsApi = ServerWsApi;
//# sourceMappingURL=ServerWsApi.js.map