import { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';

export enum StatusState {
  READY = 'ready',
  LOADING = 'loading',
  SUCCESS = 'success',
  REJECTED = 'rejected',
  ERROR = 'error',
}

export type SIWOPSession = {
  address: string;
};

export type SIWOPConfig = {
  // Required
  getNonce: () => Promise<string>;
  createAuthorizationUrl: (args: {
    nonce: string;
    address: string;
    redirectURI: string;
    // ...
  }) => string;
  verifyCode: (args: {
    code: string;
    // ...
  }) => Promise<boolean>;
  getSession: () => Promise<SIWOPSession | null>;
  signOut: () => Promise<boolean>;

  // Optional, we have default values but they can be overridden
  enabled?: boolean;
  nonceRefetchInterval?: number;
  sessionRefetchInterval?: number;
  signOutOnDisconnect?: boolean;
  signOutOnAccountChange?: boolean;
  signOutOnNetworkChange?: boolean;
};

export type SIWOPContextValue = Required<SIWOPConfig> & {
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWOPSession | null>>;
  status: StatusState;
  signIn: () => Promise<SIWOPSession | false>;
  resetStatus: () => void;
};

export const SIWOPContext = createContext<SIWOPContextValue | null>(null);
