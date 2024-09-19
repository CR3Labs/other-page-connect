import { configureServerSideSIWOP } from '@otherpage/connect-next-siwop';

export const siwopServer = configureServerSideSIWOP({
  config: {
    audience: '127.0.0.1:3004',
    clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI,
    clientSecret: process.env.SIWOP_CLIENT_SECRET,
    scope: 'avatar.read wallets.read twitter.read discord.read tokens.read communities.read',
  },
  session: {
    cookieName: 'opconnect-next-siwop',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  },
  options: {
    async afterToken(req, res, session, token) {
      // NOTE: This is where you can add custom logic to handle the token
      // e.g persist it to a datastore or make follow up API requests
      console.log('Session:', session, 'Token:', token);
    }
  }
});
