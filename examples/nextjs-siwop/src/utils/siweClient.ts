import { configureClientSIWE } from 'opconnect-next-siwe';

export const siweClient = configureClientSIWE({
  apiRoutePrefix: '/api/siwe', // Your API route directory
  statement: 'Sign In With Ethereum to prove you control this wallet.', // optional
});
