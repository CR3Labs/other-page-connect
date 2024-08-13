import { useContext } from 'react';
import { SIWOPContext, StatusState, SIWOPSession } from './SIWOPContext';

type HookProps = {
  isSignedIn: boolean;
  data?: SIWOPSession;
  status: StatusState;
  error?: Error | any;
  isRejected: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isReady: boolean;

  reset: () => void;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

type UseSIWOPConfig = {
  onSignIn?: (data?: SIWOPSession) => void;
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
      status: StatusState.ERROR,
      error: new Error('useSIWOP hook must be inside a SIWOPProvider.'),
      isRejected: false,
      isError: true,
      isLoading: false,
      isSuccess: false,
      isReady: false,
      reset: () => {},
      signIn: () => Promise.reject(),
      signOut: () => Promise.reject(),
    };
  }

  const { clientId, session, nonce, status, signOut, signIn, resetStatus } =
    siweContextValue;
  const { address } = session.data || {};

  const currentStatus = address
    ? StatusState.SUCCESS
    : session.isLoading || nonce.isLoading
    ? StatusState.LOADING
    : status;

  const isLoading = currentStatus === StatusState.LOADING;
  const isSuccess = currentStatus === StatusState.SUCCESS;
  const isRejected = currentStatus === StatusState.REJECTED;
  const isError = currentStatus === StatusState.ERROR;
  const isReady = !address || nonce.isFetching || isLoading || isSuccess;

  const reset = () => resetStatus();

  const isSignedIn = !!address;

  return {
    clientId,
    isSignedIn,
    data: isSignedIn
      ? {
          address: address as string,
        }
      : undefined,
    status: currentStatus,
    error: session.error || nonce.error,
    isRejected,
    isError,
    isLoading,
    isSuccess,
    isReady,
    signIn: async () => {
      if (!isSignedIn) {
        const data = await signIn();
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
