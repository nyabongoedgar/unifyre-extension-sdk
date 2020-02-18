import {Injectable, JsonRpcRequest, JsonRpcResponse} from "ferrum-plumbing";
import {ServerApi, ServerApiError} from "../common/ServerApi";
import {AsyncRequestRepeater} from "./AsyncRequestRepeater";

export class WalletJsonRpcClient implements Injectable {
  constructor(private api: ServerApi, private repeater: AsyncRequestRepeater) {
  }

  __name__(): string { return 'WalletRpcClient'; }

  /**
   * Asynchronously calls the wallet. Produces a response once a result is ready.
   * This may be done through polling or websockets, but the user sees this as a
   * simple request/response.
   */
  async call(appId: string, req: JsonRpcRequest): Promise<JsonRpcResponse> {
    const {requestId} = this.jsonRpcRes(await this.api.post('extension/walletProxy/createRequest', req));
    return this.repeater.registerPromise(async (id: number) => {
      return await this.api.get(`extension/walletProxy/getResponse/${requestId}`, {}) as JsonRpcResponse;
    });
  }

  jsonRpcRes(res: any) {
    if (!!res.serverError) {
      throw new ServerApiError(500, res.serverError);
    }
    return res.data;
  }
}