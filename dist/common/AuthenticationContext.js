"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthenticationContext {
    __name__() { return 'AuthenticationContext'; }
    setBearerAuth(token) {
        this._bearerToken = token;
    }
    setSession(session) {
        this._session = session;
    }
    getBearerToken() {
        return this._bearerToken;
    }
    getSession() {
        return this._session;
    }
}
exports.AuthenticationContext = AuthenticationContext;
//# sourceMappingURL=AuthenticationContext.js.map