import { HexString } from "ferrum-plumbing";
export interface SendMoneyResponse {
    transactionId: string;
}
export interface SignedMessageResponse {
    signature: {
        r: HexString;
        s: HexString;
        v: number;
    };
    publicKeyHex: HexString;
}
//# sourceMappingURL=Types.d.ts.map