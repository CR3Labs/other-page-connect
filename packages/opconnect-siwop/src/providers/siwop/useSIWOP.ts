import { useContext, useState } from 'react';
import { SIWOPContext, StatusState, SIWOPSession } from './SIWOPContext';

type HookProps = {
  isSignedIn: boolean;
  data?: SIWOPSession;
  idToken?: string;
  status: StatusState;
  error?: Error | any;
  isRejected: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isReady: boolean;

  reset: () => void;
  signIn: ({
    address,
    prompt,
  }: {
    address?: string;
    prompt?: 'consent' | 'login' | 'none';
  }) => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

type UseSIWOPConfig = {
  onSignIn?: (data?: SIWOPSession) => any;
  onSignOut?: () => void;
};

// Consumer-facing hook
export const useSIWOP = ({ onSignIn, onSignOut }: UseSIWOPConfig = {}):
  | HookProps
  | any => {
  const siweContextValue = useContext(SIWOPContext);
  if (!siweContextValue) {
    return {
      isSignedIn: false,
      data: undefined,
      idToken: undefined,
      status: StatusState.ERROR,
      error: new Error('useSIWOP hook must be inside a SIWOPProvider.'),
      isRejected: false,
      isError: true,
      isLoading: true,
      isSuccess: false,
      isReady: false,
      reset: () => {},
      signIn: () => Promise.reject(),
      signOut: () => Promise.reject(),
    };
  }

  const { clientId, session, nonce, status, idToken, signOut, signIn, resetStatus } =
    siweContextValue;
  const { account } = session.data || {};

  const currentStatus = account
    ? StatusState.SUCCESS
    : session.isLoading || nonce.isLoading
    ? StatusState.LOADING
    : status;

  const isLoading = currentStatus === StatusState.LOADING;
  const isSuccess = currentStatus === StatusState.SUCCESS;
  const isRejected = currentStatus === StatusState.REJECTED;
  const isError = currentStatus === StatusState.ERROR;
  const isReady = !account || nonce.isFetching || isLoading || isSuccess;

  const reset = () => resetStatus();

  const isSignedIn = !!account;

  return {
    appUrl: siweContextValue.appUrl,
    redirectUri: siweContextValue.redirectUri,
    clientId,
    isSignedIn,
    data: isSignedIn
      ? account
      : undefined,
    idToken: isSignedIn
      ? idToken
      : undefined,
    status: currentStatus,
    error: session.error || nonce.error,
    isRejected,
    isError,
    isLoading,
    isSuccess,
    isReady,
    signIn: async ({ address, prompt }) => {
      if (!isSignedIn) {
        const data = await signIn({ address, prompt });
        if (data) onSignIn?.(data);
      }
    },
    signOut: async () => {
      if (isSignedIn) {
        await signOut();
        onSignOut?.();
      }
    },
    reset,
  };
};
