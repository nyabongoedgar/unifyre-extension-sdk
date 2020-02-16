# unifyre-extension-sdk
Extension SDK for Unifyre

An extension application to Unifyre or Kudi can be used to create a web-app that directly connects to the waller. The created web app can access some of the user profile data such as user address(es) and ask wallet to sign transactions.

## How to extend Unifyre or Kudi

You need to register an appId with the backend. Contact Ferrum team to discuss your application.

Once you have an app ID, add `unifyre-extension-kit` as your project dependency and use the `UnifyreExtensionKitClient` to access user profile or the unifyre wallet.

## Starting a session

Currently a session can only be started directly from the wallet. Wallet will request the server for a URL for a given App ID. The url is in the format: `https://YOUR_APP_HOST.COM?token=SESSION_TOKEN`. You can then extract the token from the redirect URL and use is to talk to server.

## Initializing the extension app

```
 import {UnifyreExtensionKitWeb} from 'unifyre-extension-kit/dist/web/UnifyreExtensionKitWeb';

 const token = (new URL(document.location)).searchParams.get("token");

 UnifyreExtensionKitWeb.initializeUnifyre('MY_APP_ID').then(async () => console.log(await UnifyreExtensionKitWeb.client().signInWithToken(token)));
```
