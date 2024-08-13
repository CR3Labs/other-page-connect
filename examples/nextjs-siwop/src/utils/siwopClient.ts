import { configureClientSIWOP } from 'opconnect-next-siwop';

export const siwopClient = configureClientSIWOP({
  apiRoutePrefix: '/api/siwop', // Your API route directory
  clientId: '019f608c-04c6-4568-b4d1-8e6ee24789b2', // Your SIWOP client ID
  redirectURI: 'https://127.0.0.1:3004', // Your SIWOP redirect URI
  scope: [
    'avatar.read',
    'wallets.read',
    'twitter.read',
    'discord.read',
    'tokens.read',
    'communities.read',
  ].join('+'), // Your SIWOP scopes
});
