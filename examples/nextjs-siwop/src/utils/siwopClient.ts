import { configureClientSIWOP } from '@otherpage/connect-next-siwop';

export const siwopClient = configureClientSIWOP({
  // appUrl: 'http://127.0.0.1:3001', // For non-production enviroments only
  apiRoutePrefix: '/api/siwop', // Your API route directory
  clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID as string, // Your SIWOP client ID
  redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI as string, // Your SIWOP redirect URI
  scope: [
    'avatar.read',
    'wallets.read',
    'twitter.read',
    'discord.read',
    'tokens.read',
    'communities.read',
  ].join(' '), // Your SIWOP scopes
});
