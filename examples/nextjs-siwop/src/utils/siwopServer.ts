import { configureServerSideSIWOP } from '@otherpage/connect-next-siwop';

// const API_URL = 'http://127.0.0.1:3003/v1';
const API_URL = 'https://alpha-api.other.page/v1';

export const siwopServer = configureServerSideSIWOP({
  config: {
    authApiUrl: API_URL,
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
      const account = await getAccount(token.access_token);
      console.log(account);
    }
  }
});

// --- example --- //

async function getAccount(
  accessToken: string  
) {
  // Perform the POST request to the external API
  const response = await fetch(`${API_URL}/account`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch account data');
  }

  return response.json();
}
