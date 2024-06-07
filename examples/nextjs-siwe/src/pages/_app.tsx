import '@/styles/globals.css';
import { siweClient } from '@/utils/siweClient';
import { OPConnectProvider, getDefaultConfig } from 'opconnect';
import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'My OPConnect App',
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <siweClient.Provider>
        <OPConnectProvider>
          <Component {...pageProps} />
        </OPConnectProvider>
      </siweClient.Provider>
    </WagmiProvider>
  );
}