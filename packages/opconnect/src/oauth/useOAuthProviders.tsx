import { useMemo } from 'react';
import { coinbaseWallet } from 'wagmi/connectors';
import { WalletProps } from '../wallets/useWallets';

export const useOAuthProviders = () => {
  const smartWalletConnector = useMemo(() => {
    const connector = coinbaseWallet({
      appName: 'Canopy Wallet Connect',
      preference: 'smartWalletOnly',
    });
    return {
      id: 'coinbase-smart-wallet',
      name: 'Smart Wallet',
      connector: connector as any,
      iconShape: 'squircle',
      isInstalled: false,
    } as WalletProps;
  }, []);

  return { smartWalletConnectors: [smartWalletConnector] };
};
