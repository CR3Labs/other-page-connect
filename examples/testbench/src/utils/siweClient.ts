import { configureClientSIWE } from 'opconnect-next-siwe';

export const siweClient = configureClientSIWE({
  apiRoutePrefix: '/api/siwe',
  statement: 'fam token wen',
});
