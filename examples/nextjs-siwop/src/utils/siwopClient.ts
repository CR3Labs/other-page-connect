import { configureClientSIWOP } from '@otherpage/connect-next-siwop';

export const siwopClient = configureClientSIWOP({
  apiRoutePrefix: '/api/siwop',
  clientId: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID as string,
  redirectUri: process.env.NEXT_PUBLIC_SIWOP_REDIRECT_URI as string,
  scope: [
    'openid',
    'profile',
    // 'email',
    'badges.read',
    // 'avatar.read',
    'avatars.read',
    // 'wallets.read',
    // 'twitter.read',
    // 'discord.read',
    'tokens.read',
    'communities.read',
    'communities.write',
  ].join(' '), // Your SIWOP scopes (NOTE: must match the scopes in the server config)
});
