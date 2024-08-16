# opconnect-next-siwop

Sign in With Other Page acts as a drop in replacement of other forms of authentication for your app. Using SIWOP enables your users to login once across all of your apps and bring their Other Page avatars and profile data with them.

>SIWOP is based on a slightly modified version of the OAuth2 protocol, specifically designed to work along side standard Web3 wallet connections.
>
>[Read the Full documentation](https://alpha-admin.other.page/docs/)

## Required Config

- `SESSION_SECRET` — a randomly generated, strong password of at least 32 characters
- `NEXT_PUBLIC_SIWOP_CLIENT_ID` - your client id obtained in the Other Page Community dashboard
- `SIWOP_CLIENT_SECRET` - your client secret obtained in the Other Page Community dashboard
- `NEXT_PUBLIC_SIWOP_REDIRECT_URI` - your redirect_uri, this must match what is defined for your client in the Other Page Community dashboard

## Getting Started

**1. Install the required dependencies**

```bash
$ npm install @otherpage/connect-next-siwop
```



**2. Configure the client and context**

```tsx
// utils/siwopClient.ts
import { configureClientSIWOP } from '@otherpage/connect-next-siwop';

const siwopClient = configureClientSIWOP({
  appUrl: 'http://127.0.0.1:3001', // For non-production enviroments only
  apiRoutePrefix: '/api/siwop', // Your API route directory
  clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID as string, // Your SIWOP client ID
  redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI as string, // Your redirect URI
  scope: 'avatar.read wallets.read twitter.read', // Your desired scopes
});

...

<siwopClient.Provider>
  <OPConnectProvider>
    /* Your App */
  </OPConnectProvider>
</siwopClient.Provider>
```

**3. Configure the required server API routes.**

Create a file inside your Next API folder `api/siwop/[...route].ts`.

```typescript
// api/siwop/[...route].ts
import { configureServerSideSIWOP } from '@otherpage/connect-next-siwop';

const siwopServer = configureServerSideSIWOP({
  config: {
    audience: 'yourdomain.com',
    clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI,
    clientSecret: process.env.SIWOP_CLIENT_SECRET,
    scope: 'avatar.read wallets.read twitter.read', // Matching scopes
  },
  session: {
    cookieName: 'opconnect-next-siwop',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  },
});

export default siwopServer.apiRouteHandler
```

**4. OPConnect Modal**

After a user connects a wallet, it will now prompt the user to authenticate to your app using their Other Page account.

```tsx
<ConnectButton />
```
