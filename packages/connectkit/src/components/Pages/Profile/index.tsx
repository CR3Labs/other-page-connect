import React, { useEffect, useState } from 'react';
import { useContext } from '../../ConnectKit';
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
  BackgroundImage,
} from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
} from '../../Common/Modal/styles';
import Button from '../../Common/Button';
import Avatar from '../../Common/Avatar';
import ChainSelector from '../../Common/ChainSelect';

import { DisconnectIcon } from '../../../assets/icons';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider';
import useLocales from '../../../hooks/useLocales';
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig';
// @ts-ignore don't want to ship types for image imports that may conflict with those set by consumers
import backgroundImageSrc from './modal-background.webp';

const Profile: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const context = useContext();
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
      <BackgroundImage src={backgroundImageSrc} />
      <ModalContent style={{ paddingBottom: 10, gap: 6 }}>
        <AvatarContainer>
          <Avatar address={address} width="100%" height={149} radius={0} />
          <ChainSelectorContainer>
            <ChainSelector />
          </ChainSelectorContainer>
          <InfoBox>
            <ModalH1>
              <CopyToClipboard string={address}>
                {ensName ?? truncateEthAddress(address, separator)}
              </CopyToClipboard>
            </ModalH1>
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
