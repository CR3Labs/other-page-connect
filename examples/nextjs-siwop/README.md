# [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + Sign in With Other Page Connect Example

This project provides a full example of how to implement [Sign in With Other Page](packages/opconnect-next-siwop) in a Nextjs app. Sign in With Other Page acts as a drop in replacement for other forms of authentication, enabling your users to login once across all of your apps and bring their avatars and profile data with them.

## Running the example

1. Copy the `.env.example` file to `.env.local` and fill in the values

   - `SESSION_SECRET` — a randomly generated, strong password of at least 32 characters
   - `NEXT_PUBLIC_SIWOP_CLIENT_ID` - your client id obtained in the Other Page Community dashboard
   - `SIWOP_CLIENT_SECRET` - your client secret obtained in the Other Page Community dashboard
   - `NEXT_PUBLIC_SIWOP_REDIRECT_URI` - your redirect_uri, this must match what is defined for your client in the Other Page Community dashboard
   
2. Install `$ npm install`

3. Run `$ npm run dev`