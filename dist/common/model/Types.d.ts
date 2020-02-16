import { HexString } from "ferrum-plumbing";
export interface SendMoneyResponse {
    transactionId: string;
    transaction: any;
}
export interface SignedMessageResponse {
    signatureHex: HexString;
    publicKeyHex: HexString;
}
//# sourceMappingURL=Types.d.ts.map