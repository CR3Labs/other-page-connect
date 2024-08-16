# opconnect-next-siwe

OPConnect provides a simple solution for integrating [Sign In With Ethereum](https://login.xyz), a secure [authentication standard](https://docs.login.xyz/general-information/siwe-overview/eip-4361), to your Next.js app.

# SIWE --- Next.js Implementation

OPConnect provides a simple way to add [Sign In With Ethereum](https://login.xyz/) (SIWE) to your Next.js app.

## 1\. Install

Once you've set up OPConnect, install the official [Sign In With Ethereum package](https://www.npmjs.com/package/siwe) and our [SIWE helper package](https://www.npmjs.com/package/connectkit-next-siwe) to your Next.js project.

```bash
npm install connectkit-next-siwe viem@">=2.13.3"
```

## 2\. Configure

Our SIWE package includes session handling and route helpers. You'll need to configure them before they can be used. We recommend creating two separate utility files that you can import into other areas of your app for easily retrieving session data.

The `apiRoutePrefix` refers to a new directory you'll create inside your `pages/api` directory for the SIWE-specific routes.

```javascript
// @/utils/siweClient.ts
import { configureClientSIWE } from '@otherpage/connect-next-siwe';

export const siweClient = configureClientSIWE({
  apiRoutePrefix: '/api/siwe', // Your API route directory
  statement: 'Sign In With Ethereum to prove you control this wallet.', // optional
});
```

The server configuration needs to be separate from the client so it does not get built into the frontend bundle.

You can import your `config` from your `Web3Provider` component to bring over your `chains` and `transports` configuration to use as the public client to verify the SIWE signature.

```javascript
// @/components/Web3Provider.tsx
import { getDefaultConfig } from "opconnect";

export const config = getDefaultConfig({ ... });
```

```javascript
// @/utils/siweServer.ts
import { configureServerSideSIWE } from '@otherpage/connect-next-siwe';
import { config } from '@/components/Web3Provider';

export const siweServer = configureServerSideSIWE({
  // OPTIONAL Config
  config: {
    chains: config.chains,
    transports: config.transports,
  },
  // MANDATORY
  session: {
    cookieName: 'opconnect-next-siwe',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});
```

You'll also want to set up an environment variable called `SESSION_SECRET` — a randomly generated, strong password of at least 32 characters. This is used to encrypt the browser cookie used by the session. Alternatively, you can set the session secret directly with `session: { password: ... } }` when using `configureServerSideSIWE`.

```
.env
SESSION_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

\
Add a new catch-all API route to your app inside the directory that we configured with `apiRoutePrefix`.

It's important that this file be named `[...route].ts` to take advantage of [Next's dynamic routing](https://nextjs.org/docs/routing/dynamic-routes) and because our package expects route as a named query parameter.

```javascript
// pages/api/siwe/[...route].ts
import { siweServer } from '@/utils/siweServer'; // Your path to siweServer.ts

export default siweServer.apiRouteHandler;
```

Once configured, wrap your Next.js app using the `<siweClient.Provider>` component, just like you've done previously with the `OPConnectProvider`. This lets OPConnect know that you're using SIWE and how to talk to your API routes.

```javascript
// pages/_app.tsx OR src/app/providers.tsx

import { OPConnectProvider, SIWESession} from "opconnect";
import { siweClient } from "@/utils/siweClient";

...

<siweClient.Provider
  // Optional parameters
  enabled={true} // defaults true
  nonceRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
  sessionRefetchInterval={300000}// in milliseconds, defaults to 5 minutes
  signOutOnDisconnect={true} // defaults true
  signOutOnAccountChange={true} // defaults true
  signOutOnNetworkChange={true} // defaults true
  onSignIn={(session?: SIWESession) => void}
  onSignOut={() => void}
  >
  <OPConnectProvider>
    /* Your App */
  </OPConnectProvider>
</siweClient.Provider>
```

And that's it—the OPConnect modal will now automatically walk your users through how to Sign In With Ethereum after connecting their wallet to your app.
