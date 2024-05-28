import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { OPConnectProvider, SIWESession } from 'opconnect';
import { siweClient } from '../utils/siweClient';
import { Web3Provider } from '../components/Web3Provider';
import { useTestBench } from '../TestbenchProvider';

function App({ Component, pageProps }: AppProps) {
  const { ckPrimaryColor, mode, options, customTheme } = useTestBench();
  const key = JSON.stringify({ customTheme }); // re-render on customTheme change

  return (
    <siweClient.Provider
      onSignIn={(data?: SIWESession) => {
        console.log('onSignIn Provider', data);
      }}
      onSignOut={() => {
        console.log('onSignOut Provider');
      }}
    >
      <OPConnectProvider
        key={key}
        mode={mode}
        primaryColor={ckPrimaryColor}
        options={options}
        customTheme={customTheme}
        onConnect={(data) => {
          console.log('onConnect Provider', data);
        }}
        onDisconnect={() => {
          console.log('onDisconnect Provider');
        }}
        debugMode
      >
        <Component {...pageProps} />
      </OPConnectProvider>
    </siweClient.Provider>
  );
}
function MyApp(appProps: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>OPConnect Testbench</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <Web3Provider>
        <App {...appProps} />
      </Web3Provider>
    </>
  );
}

export default MyApp;
