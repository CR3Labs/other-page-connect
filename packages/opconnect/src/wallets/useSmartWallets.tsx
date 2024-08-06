import { useMemo } from 'react';
import { isCoinbaseWalletConnector } from '../utils';
import { useWallets } from './useWallets';

export const useSmartWallets = () => {
  const wallets = useWallets();

  return useMemo(() => {
    return wallets.filter((wallet) =>
      isCoinbaseWalletConnector(wallet.connector.id)
    );
  }, [wallets]);
};
