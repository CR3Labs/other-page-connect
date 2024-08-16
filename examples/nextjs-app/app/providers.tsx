'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../config';
import { OPConnectProvider } from '@otherpage/connect';

const queryClient = new QueryClient();
export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OPConnectProvider>{props.children}</OPConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
