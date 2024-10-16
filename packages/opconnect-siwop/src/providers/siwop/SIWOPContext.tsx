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
  nonce: string;
  account?: any; // TODO type this
  idToken?: string;
};

export type SIWOPConfig = {
  // Required fields
  clientId: string;
  redirectUri: string;
  scope: string;

  // Required functions
  getNonce: () => Promise<string>;
  createAuthorizationUrl: (args: {
    nonce: string;
    address?: string;
    prompt?: 'login' | 'consent' | 'none';
    code_challenge: string;
    appUrl: string;
  }) => string;
  verifyCode: (args: {
    code: string;
  }) => Promise<SIWOPSession>;
  generatePKCE: () => Promise<{ codeChallenge: string; codeVerifier: string }>;
  getSession: () => Promise<SIWOPSession | null>;
  signOut: () => Promise<boolean>;

  // Optional, we have default values but they can be overridden
  appUrl?: string;
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
  idToken: string | undefined;
  signIn: ({ address, prompt }: { address?: string; prompt?: 'consent' | 'login' | 'none' }) => Promise<SIWOPSession | false >;
  resetStatus: () => void;
};

export const SIWOPContext = createContext<SIWOPContextValue | null>(null);
