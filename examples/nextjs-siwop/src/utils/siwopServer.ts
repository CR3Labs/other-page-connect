import { configureServerSideSIWOP } from 'opconnect-next-siwop';

export const siwopServer = configureServerSideSIWOP({
  config: {
    clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI,
    clientSecret: process.env.SIWOP_CLIENT_SECRET,
    scope: 'avatar.read wallets.read twitter.read discord.read tokens.read communities.read',
  },
  session: {
    cookieName: 'opconnect-next-siwop',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});
