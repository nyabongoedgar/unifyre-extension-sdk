import {Injectable} from "ferrum-plumbing";

export class AuthenticationContext implements Injectable {
  private _bearerToken: string | undefined;
  private _wsToken: string | undefined;
  private _legacySession: string | undefined;

  __name__(): string { return 'AuthenticationContext'; }

  setBearerAuth(token: string) {
    this._bearerToken = token;
  }

  setLegacySession(session: string) {
    this._legacySession = session;
  }

  setWsToken(token: string) {
    this._wsToken = token;
  }

  getBearerToken(): string | undefined {
    return this._bearerToken;
  }

  getLegacySession(): string | undefined {
    return this._legacySession;
  }
}