export const OPCONNECT_VERSION = '0.4.0';

export * as Types from './types';
export { default as getDefaultConfig } from './defaultConfig';
export { default as getDefaultConnectors } from './defaultConnectors';
export { wallets } from './wallets';

export { useModal } from './hooks/useModal';
export { SIWEProvider, useSIWE } from './siwe';
export type { SIWESession, SIWEConfig } from './siwe';

export { OPConnectProvider, Context } from './components/OPConnect';
export { ConnectButton } from './components/ConnectButton';
export { default as SIWEButton } from './components/Standard/SIWE';

//export { default as NetworkButton } from './components/NetworkButton';
//export { default as BalanceButton, Balance } from './components/BalanceButton';
export { default as Avatar } from './components/Common/Avatar';
export { default as ChainIcon } from './components/Common/Chain';

// Hooks
export { default as useIsMounted } from './hooks/useIsMounted'; // Useful for apps that use SSR
export { useChains } from './hooks/useChains';
export { useChainIsSupported } from './hooks/useChainIsSupported';

// TODO: Make this private
export { default as OPConnectModalDemo } from './components/ConnectModal/demo';
