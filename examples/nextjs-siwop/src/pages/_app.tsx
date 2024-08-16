import '@/styles/globals.css';
import { siwopClient } from '@/utils/siwopClient';
import { OPConnectProvider, getDefaultConfig } from '@otherpage/connect';
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
          <OPConnectProvider mode={mode} primaryColor={primaryColor} options={{
            disclaimer: (
              <div>
                By connecting your wallet you agree to the{' '}
                <a href="https://cr3labs.com/terms" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="https://cr3labs.com/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
              </div>
            ),
          }}>
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
