import { configureServerSideSIWE } from 'opconnect-next-siwe';

export const siweServer = configureServerSideSIWE({
  session: {
    cookieName: 'opconnect-next-siwe',
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});
