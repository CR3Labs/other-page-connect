import { ReactNode, useContext, useEffect, useState } from 'react';
import { useAccount, useAccountEffect, useSignMessage } from 'wagmi';
import { getAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { Context as OPConnectContext } from '../components/OPConnect';
import {
  SIWOPContext,
  SIWOPConfig,
  StatusState,
  SIWOPSession,
} from './SIWOPContext';

type Props = SIWOPConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWOPSession) => void;
  onSignOut?: () => void;
};

export const SIWOPProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  onSignIn,
  onSignOut,
  ...siwopConfig
}: Props) => {
  const [status, setStatus] = useState<StatusState>(StatusState.READY);
  const resetStatus = () => setStatus(StatusState.READY);

  // Only allow for mounting SIWOPProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWOPContext)) {
    throw new Error(
      'Multiple, nested usages of SIWOPProvider detected. Please use only one.'
    );
  }
  // SIWOPProvider must be wrapped outside of OPConnectProvider so that the
  // OPConnectButton and other UI can use SIWOP context values.
  if (useContext(OPConnectContext)) {
    throw new Error('OPConnectProvider must be mounted inside SIWOPProvider.');
  }

  const nonce = useQuery({
    queryKey: ['ckSiweNonce'],
    queryFn: () => siwopConfig.getNonce(),
    refetchInterval: nonceRefetchInterval,
  });

  const session = useQuery({
    queryKey: ['ckSiweSession'],
    queryFn: () => siwopConfig.getSession(),
    refetchInterval: sessionRefetchInterval,
  });

  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(StatusState.LOADING);
    if (!(await siwopConfig.signOut())) {
      throw new Error('Failed to sign out.');
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(StatusState.READY);
    onSignOut?.();
    return true;
  };

  const { address: connectedAddress } = useAccount();
  useAccountEffect({
    onDisconnect: () => {
      if (signOutOnDisconnect) {
        // For security reasons we sign out the user when a wallet disconnects.
        signOutAndRefetch();
      }
    },
  });

  const { address, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const onError = (error: any) => {
    console.error('signIn error', error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case 'ACTION_REJECTED': // MetaMask: user rejected
        setStatus(StatusState.REJECTED);
        break;
      default:
        setStatus(StatusState.ERROR);
    }
  };

  const signIn = async () => {
    try {
      if (!siwopConfig) {
        throw new Error('SIWOP not configured');
      }

      const chainId = chain?.id;
      if (!address) throw new Error('No address found');
      if (!chainId) throw new Error('No chainId found');

      if (!nonce.data) {
        throw new Error('Could not fetch nonce');
      }

      setStatus(StatusState.LOADING);

      const url = siwopConfig.createAuthorizationUrl({
        address,
        nonce: nonce?.data,
        redirectURI: window.location.href,
      });
      console.log('url', url);

      // redirect user to Authorization URL

      // TODO refetch session after 
      // redirect if code exists in url
      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(StatusState.READY);
      return data as SIWOPSession;
    } catch (error) {
      onError(error);
      return false;
    }
  };

  useEffect(() => {
    // Skip if we're still fetching session state from backend
    if (!sessionData || !sessionData.address) return;
    // Skip if wallet isn't connected (i.e. initial page load)
    if (!connectedAddress || !chain) return;

    // If SIWOP session no longer matches connected account, sign out
    if (
      signOutOnAccountChange &&
      getAddress(sessionData.address) !== getAddress(connectedAddress)
    ) {
      console.warn('Wallet account changed, signing out of SIWOP session');
      signOutAndRefetch();
    }
    // The SIWOP spec includes a chainId parameter for contract-based accounts,
    // so we're being extra cautious about keeping the SIWOP session and the
    // connected account/network in sync. But this can be disabled when
    // configuring the SIWOPProvider.
    else if (signOutOnNetworkChange && sessionData.address !== connectedAddress) {
      console.warn('Wallet changed, signing out of SIWOP session');
      signOutAndRefetch();
    }
  }, [sessionData, connectedAddress, chain]);

  return (
    <SIWOPContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siwopConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
      }}
    >
      {children}
    </SIWOPContext.Provider>
  );
};
