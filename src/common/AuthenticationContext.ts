import {Injectable} from "ferrum-plumbing";

export class AuthenticationContext implements Injectable {
  private _bearerToken: string | undefined;
  private _session: string | undefined;

  __name__(): string { return 'AuthenticationContext'; }

  setBearerAuth(token: string) {
    this._bearerToken = token;
  }

  setSession(session: string) {
    this._session = session;
  }

  getBearerToken(): string | undefined {
    return this._bearerToken;
  }

  getSession(): string | undefined {
    return this._session;
  }
}