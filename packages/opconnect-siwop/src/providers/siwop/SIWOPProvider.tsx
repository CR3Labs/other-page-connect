import { ReactNode, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useQueryParams from '../../hooks/useQueryParams';

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
  appUrl = 'https://alpha.other.page',
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
  const [idToken, setIdToken] = useState<string>();
  const [authorizing, setIsAuthorizing] = useState(false);  
  const queryParams = useQueryParams();

  // Only allow for mounting SIWOPProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWOPContext)) {
    throw new Error(
      'Multiple, nested usages of SIWOPProvider detected. Please use only one.'
    );
  }

  const nonce = useQuery({
    queryKey: ['siwopNonce'],
    queryFn: () => siwopConfig.getNonce(),
    refetchInterval: nonceRefetchInterval,
  });

  const session = useQuery({
    queryKey: ['siwopSession'],
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
    setIdToken(undefined);
    onSignOut?.();
    return true;
  };

  const onError = (error: any) => {
    console.error('signIn error', error.code, error.message);
    switch (error.code) {
      case 400: // User denied scopes
      case 'ACTION_REJECTED': // User denied scopes
        setStatus(StatusState.REJECTED);
        break;
      default:
        setStatus(StatusState.ERROR);
    }
  };

  const signIn = async (address?: string) => {
    try {
      if (!siwopConfig) {
        throw new Error('SIWOP not configured');
      }

      if (!nonce.data) {
        throw new Error('Could not fetch nonce');
      }

      setStatus(StatusState.LOADING);
      
      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      if (data) {
        setStatus(StatusState.READY);
        return data as SIWOPSession;
      }

      // generate and store PKCE
      // NOTE: code verifier being stored in cookie is a security risk
      // if the user does not properly configure httpOnly, secure, same-site cookies
      const { codeChallenge } = await siwopConfig.generatePKCE();

      // create url
      const url = siwopConfig.createAuthorizationUrl({
        address,
        nonce: nonce.data,
        code_challenge: codeChallenge, 
        appUrl,
      });

      window.location.href = url;
      
      return false;
    } catch (error) {
      onError(error);
      return false;
    }
  };

  useEffect(() => {
    if (authorizing) return;

    // retrieve oauth params from query
    const code = queryParams?.get('code');
    const state = queryParams?.get('state');

    // retrieve code from url
    if (nonce.data && code && state) {
      setIsAuthorizing(true);

      // Check state cookie or set error
      if (nonce.data !== state) { 
        console.error('Invalid nonce');
        setStatus(StatusState.ERROR);
        setIsAuthorizing(false);
        return;
      }

      // Verify code
      siwopConfig.verifyCode({ code }).then((data) => {
        if (!data) {
          console.error('Code verification failed');
          setStatus(StatusState.ERROR);
          setIsAuthorizing(false);
          return;
        }

        // set auth session
        session.refetch().then(() => {
          setStatus(StatusState.SUCCESS);
          setIdToken(data.idToken);
          onSignIn?.(data);
        });

        // remove code from url
        window.history.replaceState({}, document.title, window.location.pathname);

        setIsAuthorizing(false);
      }).catch((e) => {
        console.error(e);
        setStatus(StatusState.ERROR);
        setIsAuthorizing(false);
      });
    }
  
    // set id_token
    if (sessionData?.idToken) {
      setIdToken(sessionData.idToken);
    }

    // Skip if we're still fetching session state from backend
    if (!sessionData || !sessionData.account) return;

    // If SIWOP session no longer matches connected account, sign out
    // TODO this would have to validate against linked wallets
    // so it needs to be handled outside of the SIWOP flow for now
    // because we can't require the `wallets.read` scope

    // if (
    //   signOutOnAccountChange &&
    //   getAddress(sessionData.address) !== getAddress(connectedAddress)
    // ) {
    //   console.warn('Wallet changed, signing out of SIWOP session');
    //   setStatus(StatusState.ERROR);
    //   signOutAndRefetch();
    // }
    // // The SIWE spec includes a chainId parameter for contract-based accounts,
    // // so we may want to follow this and keep the SIWOP session and the
    // // connected account in sync on the same chain and address
    // else if (signOutOnNetworkChange && sessionData.chainId !== chain?.id) {
    //   console.warn('Network changed, signing out of SIWOP session');
    //   // signOutAndRefetch();
    // }
  }, [nonce, sessionData, queryParams]);

  return (
    <SIWOPContext.Provider
      value={{
        appUrl,
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siwopConfig,
        nonce,
        session,
        idToken,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
        clientId: siwopConfig.clientId,
        redirectUri: siwopConfig.redirectUri,
        scope: siwopConfig.scope,
      }}
    >
      {children}
    </SIWOPContext.Provider>
  );
};
