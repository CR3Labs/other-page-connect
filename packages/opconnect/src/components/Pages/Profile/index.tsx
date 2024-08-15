import React, { useEffect, useState } from 'react';
import { routes, useContext } from '../../OPConnect';
import {
  isSafeConnector,
  nFormatter,
  truncateEthAddress,
} from '../../../utils';

import {
  useConnect,
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
} from 'wagmi';

import {
  AvatarContainer,
  ChainSelectorContainer,
  BalanceContainer,
  LoadingBalance,
  Balance,
  InfoBox,
  Address,
} from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
} from '../../Common/Modal/styles';
import Button from '../../Common/Button';
import Avatar from '../../Common/Avatar';
import ChainSelector from '../../Common/ChainSelect';

import { DisconnectIcon } from '../../../assets/icons';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../OPConnectThemeProvider/OPConnectThemeProvider';
import useLocales from '../../../hooks/useLocales';
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig';
import { useSIWE } from '../../../siwe';
import { useSIWOP } from '../../../siwop';

const ForwardIcon = ({ ...props }) => (
  <svg
    width="8"
    height="13"
    viewBox="0 0 8 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.17192 6.5L0.221924 1.55L1.63592 0.136002L7.99992 6.5L1.63592 12.864L0.221924 11.45L5.17192 6.5Z"
      fill="currentColor"
    />
  </svg>
);

const Profile: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const context = useContext();
  const { reset: resetSIWE, isSignedIn: isSIWESignedIn } = useSIWE();
  const { signIn, isSignedIn: isSIWOPSignedIn } = useSIWOP();
  const themeContext = useThemeContext();

  const locales = useLocales();

  const { reset } = useConnect();
  const { disconnect } = useDisconnect();

  const { address, isConnected, connector, chain } = useAccount();
  const ensFallbackConfig = useEnsFallbackConfig();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
    config: ensFallbackConfig,
  });
  const { data: balance } = useBalance({
    address,
    //watch: true,
  });

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  useEffect(() => {
    if (!isConnected) context.setOpen(false);
  }, [isConnected]);

  useEffect(() => {
    if (!shouldDisconnect) return;

    // Close before disconnecting to avoid layout shifting while modal is still open
    if (closeModal) {
      closeModal();
    } else {
      context.setOpen(false);
    }
    return () => {
      disconnect();
      reset();
    };
  }, [shouldDisconnect, disconnect, reset]);

  const separator = ['web95', 'rounded', 'minimal'].includes(
    themeContext.theme ?? context.theme ?? ''
  )
    ? '....'
    : undefined;
  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 0 }}>
        <AvatarContainer>
          <Avatar address={address} width="100%" radius={0} />
          <ChainSelectorContainer>
            <ChainSelector />
          </ChainSelectorContainer>
          <InfoBox>
            <Address>
              <CopyToClipboard string={address}>
                {ensName ?? truncateEthAddress(address, separator)}
              </CopyToClipboard>
            </Address>
            {context?.options?.hideBalance ? null : (
              <ModalBody>
                <BalanceContainer>
                  <AnimatePresence exitBeforeEnter initial={false}>
                    {balance && (
                      <Balance
                        key={`chain-${chain?.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {nFormatter(Number(balance?.formatted))}
                        {` `}
                        {balance?.symbol}
                      </Balance>
                    )}
                    {!balance && (
                      <LoadingBalance
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        &nbsp;
                      </LoadingBalance>
                    )}
                  </AnimatePresence>
                </BalanceContainer>
              </ModalBody>
            )}
          </InfoBox>
        </AvatarContainer>
      </ModalContent>
      {context.signInWithOtherPage && !isSIWOPSignedIn && (
        <Button
          variant="primary"
          iconPosition="right"
          onClick={signIn}
          icon={<ForwardIcon />}
        >
          {locales.signInWithOtherPageScreen_signedOut_heading}
        </Button>
      )}
      {context.signInWithEthereum && !isSIWESignedIn && (
        <Button
          variant="primary"
          iconPosition="right"
          onClick={() => {
            resetSIWE();
            context.setRoute(routes.SIGNINWITHETHEREUM);
          }}
          icon={<ForwardIcon />}
        >
          {locales.signInWithOtherPageScreen_signedOut_heading}
        </Button>
      )}
      {!isSafeConnector(connector?.id) && (
        <Button
          onClick={() => setShouldDisconnect(true)}
          icon={<DisconnectIcon />}
        >
          {locales.disconnect}
        </Button>
      )}
    </PageContent>
  );
};

export default Profile;
