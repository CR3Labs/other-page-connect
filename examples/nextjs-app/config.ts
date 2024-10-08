import { getDefaultConfig } from '@otherpage/connect';
import { createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

export const config = createConfig(
  getDefaultConfig({
    appName: 'OPConnect Next.js demo',
    chains: [mainnet, polygon, optimism, arbitrum],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
