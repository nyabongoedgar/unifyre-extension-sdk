import {HexString} from "ferrum-plumbing";
import {SignableMessageType} from "../../common/model/SignableMessages";
import {SendMoneyResponse, SignedMessageResponse} from "../../common/model/Types";

export interface RemoteSendMoneyRequest {
  accountGroupId?: string;
  currency: string;
  fromAddress?: string;
  toAddress: string;
  amount: string;
}

export interface RemoteSignRequest {
  accountGroupId?: string;
  messageHes: HexString;
  messageType: SignableMessageType;
  description?: string;
}

export interface WalletRemoteRequest {
  requestId: string;
  appId: string;
  requestType: 'SIGN_CLEAR'|'SIGN_TYPED'|'SEND_MONEY';
  request: RemoteSendMoneyRequest | RemoteSignRequest
}

export interface WalletRemoteResponse {
  requestId: string;
  appId: string;
  response: SendMoneyResponse|SignedMessageResponse;
}