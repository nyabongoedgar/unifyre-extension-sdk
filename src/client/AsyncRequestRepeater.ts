import {Injectable} from "ferrum-plumbing";

export const ASYNC_API_REFRESH_TIMEOUT = 3000;
export const ASYNC_API_REQUEST_TIMEOUT = 3 * 60 * 1000; // Three minute timeout

interface AsyncApiRequest {
  handler: (id: number) => Promise<any | undefined>;
  onSuccess: (res: any) => void;
  onError: (e: Error) => void;
  onTimeout: () => void;
  time: number;
  timeout?: number;
}

export class TimeoutError extends Error {}

export class AsyncRequestRepeater implements Injectable {
  private isShutDown: boolean = false;
  private timeOutHandle: any = 0;
  private lastRequestId: number = 0;
  private requests: Map<number, AsyncApiRequest> = new Map();
  constructor() {
    this.onRefresh = this.onRefresh.bind(this);
    this.initialize();
  }

  __name__(): string { return 'AsyncApiRequestResponseManager'; }

  registerPromise<T>(action: (requestId: number) => Promise<T>, timeout?: number): Promise<T> {
    return new Promise((accept, reject) => {
      this.registerRequest(
        action,
        (res: T) => accept(res),
        e => reject(e),
        () => reject(new TimeoutError()),
        timeout,
      );
    });
  }

  registerRequest(handler: (id: number) => Promise<any>,
                  onSuccess: (res: any | undefined) => void,
                  onError: (e: Error) => void,
                  onTimeout: () => void,
                  timeout?: number) {
    this.lastRequestId += 1;
    const reqId = this.lastRequestId;
    this.requests.set(reqId, { handler, onSuccess, onError,  onTimeout, time: Date.now(), timeout} as AsyncApiRequest);
    this.onRefresh();
  }

  async onRefresh() {
    // Check all requests. Poll, or timeout.
    const deleteList: number[] = [];
    for(const key of this.requests.keys()) {
      const val = this.requests.get(key)!;
      try {
        const res = await val.handler(key);
        if (!res && Date.now() - val.time > (val.timeout || ASYNC_API_REQUEST_TIMEOUT)) {
            deleteList.push(key);
            try { val.onTimeout(); } catch (e) { }
        }
        if (!!res) {
          val.onSuccess(res);
        }
      } catch (e) {
        deleteList.push(key);
        try { val.onError(e); } catch (e) { }
      }
    }
    deleteList.forEach(k => this.requests.delete(k));
    if (!this.isShutDown) {
      setTimeout(this.onRefresh, ASYNC_API_REFRESH_TIMEOUT)
    }
  }

  shutDown() {
    this.isShutDown = true;
    if (this.timeOutHandle) {
      clearTimeout(this.timeOutHandle);
    }
  }

  initialize() {
    setTimeout(this.onRefresh, ASYNC_API_REFRESH_TIMEOUT)
  }
}