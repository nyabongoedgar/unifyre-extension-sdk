import { Injectable } from "ferrum-plumbing";
export declare class AuthenticationContext implements Injectable {
    private _bearerToken;
    private _session;
    __name__(): string;
    setBearerAuth(token: string): void;
    setSession(session: string): void;
    getBearerToken(): string | undefined;
    getSession(): string | undefined;
}
//# sourceMappingURL=AuthenticationContext.d.ts.map