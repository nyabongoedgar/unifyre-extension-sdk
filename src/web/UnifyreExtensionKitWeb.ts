import {ConsoleLogger, Container, LoggerFactory, ValidationUtils} from "ferrum-plumbing";
import {ClientModule} from "../client/ClientModule";
import {WebLocalJsonStorage} from "./WebLocalJsonStorage";
import {UnifyreExtensionKitClient} from "../client/UnifyreExtensionKitClient";

const TEST_ENDPOINT = 'http://localhost:9000/api/';
const DEV_ENDPOINT = 'https://tbe.ferrumnetwork.io/api/';
const PROD_ENDPOINT_KUDI = 'https://minimal-cloud.com/api/'; //TODO:
const PROD_ENDPOINT_UNIFYRE = 'https://tbe.ferrumnetwork.io/api/';

export class UnifyreExtensionKitWeb {
  private static _container: Container | undefined;
  static async initializeTest(appId: string) {
    return UnifyreExtensionKitWeb.initialize(appId, TEST_ENDPOINT);
  }

  static async initializeDev(appId: string) {
    return UnifyreExtensionKitWeb.initialize(appId, DEV_ENDPOINT);
  }

  static async initializeKudi(appId: string) {
    return UnifyreExtensionKitWeb.initialize(appId, PROD_ENDPOINT_KUDI);
  }

  static async initializeUnifyre(appId: string) {
    return UnifyreExtensionKitWeb.initialize(appId, PROD_ENDPOINT_UNIFYRE);
  }

  static async initialize(appId: string, apiUrl: string) {
    if (!!UnifyreExtensionKitWeb._container) {
      return UnifyreExtensionKitWeb._container;
    }
    const c = new Container();
    c.registerSingleton(LoggerFactory, () => new LoggerFactory((name => new ConsoleLogger(name))));
    c.registerSingleton('JsonStorage', () => new WebLocalJsonStorage());
    await c.registerModule(new ClientModule(apiUrl, appId));
    UnifyreExtensionKitWeb._container = c;
    return c;
  }

  static client() {
    ValidationUtils.isTrue(!!UnifyreExtensionKitWeb._container, 'Not initialized. Make sure to initialize UnifyreExtensionKitWeb.');
    return UnifyreExtensionKitWeb._container!.get<UnifyreExtensionKitClient>(UnifyreExtensionKitClient);
  }
}