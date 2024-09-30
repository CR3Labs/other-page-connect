import { configureClientSIWOP } from '@otherpage/connect-next-siwop';

export const siwopClient = configureClientSIWOP({
  apiRoutePrefix: '/api/siwop',
  clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID as string,
  redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI as string,
  scope: [
    'openid',
    'profile',
    'email',
    'avatar.read',
    'wallets.read',
    'twitter.read',
    'discord.read',
    'tokens.read',
    'communities.read',
  ].join(' '), // Your SIWOP scopes
});