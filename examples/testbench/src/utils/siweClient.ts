import { configureClientSIWE } from '@otherpage/connect-next-siwe';

export const siweClient = configureClientSIWE({
  apiRoutePrefix: '/api/siwe',
  statement: 'fam token wen',
});
