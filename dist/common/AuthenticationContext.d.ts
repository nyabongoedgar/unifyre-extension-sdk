import { Injectable } from "ferrum-plumbing";
export declare class AuthenticationContext implements Injectable {
    private _bearerToken;
    private _wsToken;
    private _legacySession;
    __name__(): string;
    setBearerAuth(token: string): void;
    setLegacySession(session: string): void;
    setWsToken(token: string): void;
    getBearerToken(): string | undefined;
    getLegacySession(): string | undefined;
}
//# sourceMappingURL=AuthenticationContext.d.ts.map