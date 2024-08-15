import { configureServerSideSIWOP } from 'opconnect-next-siwop';

const API_URL = 'http://127.0.0.1:3003/v1';

const getAccount = async (
  accessToken: string  
) => {
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
  options: {
    async afterToken(req, res, session, token) {
      console.log('Session:', session, 'Token:', token);
      const account = await getAccount(token.access_token);
      console.log(account);
    }
  }
});
