import {Injectable, JsonStorage, Logger, LoggerFactory, ValidationUtils} from "ferrum-plumbing";
import {AuthenticationContext} from "./AuthenticationContext";

export class ServerApiHeaders {
  [key: string]: string | number;
}

// TODO: Add metrics
export class ServerApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }

  static translate(e: string): string {
    if (e.indexOf('api.model.ApiError:') >= 0) {
      return e.split('api.model.ApiError:')[1];
    }
    return e;
  }

  static fromError(e: Object): string {
    return ServerApiError.translate((e as ServerApiError).message ?
      ServerApiError.cleanError((e as ServerApiError).message) : e.toString());
  }

  static stringify(e: Error): string {
    if (typeof e === 'object' && e !== null) {
      return JSON.stringify(e, Object.getOwnPropertyNames(e));
    } else return JSON.stringify(e);
  }

  private static cleanError(error: string): string {
    if ((error || '').indexOf(':') >= 0) {
      const afterColon = error.substr(error.indexOf(':') + 1).trim();
      if (afterColon.indexOf(':') >= 0) {
        return afterColon.substr(0, afterColon.indexOf(':')).trim();
      } else {
        return afterColon;
      }
    }

    return error;
  }
}

export class ServerApi implements Injectable {
  private log: Logger;
  constructor(private storage: JsonStorage,
              loggerFactory: LoggerFactory,
              private context: AuthenticationContext,
              private host: string,
  ) {
    this.log = loggerFactory.getLogger(ServerApi);
    ValidationUtils.isTrue(host.endsWith('/'), '"host" must end with slash (/)');
  }

  __name__() { return 'ServerApi'; }

  /**
   * Authenticate user using provided token
   */
  async setBearerToken(token: string): Promise<void> {
    this.context.setBearerAuth(token);
  }

  async post(command: string, data: Object, extraHeaders?: ServerApiHeaders): Promise<Object> {
    return this.fetchUrl(command, 'POST', {}, data, extraHeaders);
  }

  async get(command: string, args: Object, extraHeaders?: ServerApiHeaders): Promise<Object> {
    return this.fetchUrl(command, 'GET', args, undefined, extraHeaders);
  }

  private async fetchUrl(command: string, method: string, args: { [x: string]: any },
                         data?: Object, extraHeaders?: ServerApiHeaders): Promise<Object> {
    let fullCommand = args && Object.keys(args).length ?
      command + '?' + Object.keys(args)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(args[k]))
        .join('&') :
      command;

    const bearerToken = this.context.getBearerToken();
    const sessionHeader = this.context.getLegacySession();
    this.log.debug(`calling api '${this.host!}${fullCommand}'`, data);

    let res: any;
    try {
      // const metricCommand = command.split('/')[0];
      // const metric = this.metric.start(metricCommand);
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Session': sessionHeader,
      } as any;
      if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
      }
      if (extraHeaders) {
        Object.keys(extraHeaders).forEach(k => {headers[k] = extraHeaders[k];});
      }
      this.log.debug('Headers are', headers);

      // @ts-ignore
      res = await fetch(this.host + fullCommand, {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
      });
      // this.log.info("Result is ", res);
      // metric.done();
    } catch (e) {
      const errorText = ServerApiError.fromError(e);
      this.log.error('Error calling server', e);
      throw new ServerApiError(0,errorText);
    }

    if (res.ok) {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } else {
      const errorText = await res.text();
      this.log.error('Error calling server' + command + args + res.status + res.statusText + errorText);
      throw new ServerApiError(res.status, errorText);
    }
  }
}