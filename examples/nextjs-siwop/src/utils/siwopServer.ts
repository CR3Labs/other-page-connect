import { configureServerSideSIWOP } from 'opconnect-next-siwop';

export const siwopServer = configureServerSideSIWOP({
  config: {
    clientId: process.env.SIWOP_CLIENT_ID,
    clientSecret: process.env.SIWOP_CLIENT_SECRET,
    redirectURI: process.env.SIWOP_REDIRECT_URI,
    scope: process.env.SIWOP_SCOPE,
  },
  session: {
    cookieName: 'opconnect-next-siwop',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});
