import '@/styles/globals.css';
import { siwopClient } from '@/utils/siwopClient';
import { OPConnectProvider, getDefaultConfig } from 'opconnect';
import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useAppContext } from '@/contexts/app-provider';

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'My OPConnect App',
    ssr: true,
  })
);

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const { mode, primaryColor } = useAppContext();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <siwopClient.Provider>
          <OPConnectProvider mode={mode} primaryColor={primaryColor}>
            <Component {...pageProps} />
          </OPConnectProvider>
        </siwopClient.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function MyApp(appProps: AppProps) {
  return (
    <AppProvider>
      <App {...appProps} />
    </AppProvider>
  );
}

export default MyApp;
