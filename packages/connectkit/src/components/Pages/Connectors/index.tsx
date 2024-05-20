import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';

import {
  LearnMoreContainer,
  LearnMoreButton,
  InfoBox,
  InfoBoxButtons,
  ConnectorWrapper,
  ConnectContainer,
  QRConnectContainer,
  WalletNameContainer,
  CustomQRCodeContainer,
  OrContainer,
} from './styles';
import {
  PageContent,
  Disclaimer,
  ModalContent,
  ModalH1,
  ModalBody,
} from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import useLocales from '../../../hooks/useLocales';
import ConnectorList from '../../Common/ConnectorList';
import useIsMobile from '../../../hooks/useIsMobile';
import Button from '../../Common/Button';
import { useWallets } from '../../../wallets/useWallets';
import { useLastConnector } from '../../../hooks/useLastConnector';
import FitText from '../../Common/FitText';
import CustomQRCode from '../../Common/CustomQRCode';
import { useWeb3 } from '../../contexts/web3';
import {
  isCoinbaseWalletConnector,
  isWalletConnectConnector,
} from '../../../utils';
import ScanIconWithLogos from '../../../assets/ScanIconWithLogos';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const wallets = useWallets();

  const isMobile = useIsMobile();
  const { lastConnectorId } = useLastConnector();

  const walletsToDisplay =
    context.options?.hideRecentBadge || lastConnectorId === 'walletConnect' // do not hoist walletconnect to top of list
      ? wallets
      : [
          // move last used wallet to top of list
          // using .filter and spread to avoid mutating original array order with .sort
          ...wallets.filter(
            (wallet) => lastConnectorId === wallet.connector.id
          ),
          ...wallets.filter(
            (wallet) => lastConnectorId !== wallet.connector.id
          ),
        ];

  const selectedWallet = walletsToDisplay.find(
    (wallet) => wallet.id === context.selectedConnector.id
  );
  useEffect(() => {
    if (
      !context.selectedConnector.id &&
      walletsToDisplay &&
      walletsToDisplay?.length > 0
    ) {
      context.setSelectedConnector({ id: walletsToDisplay?.[0].id });
    }
  }, [context.selectedConnector.id, walletsToDisplay]);

  const id = context.selectedConnector.id;

  const {
    connect: { getUri },
  } = useWeb3();

  const wcUri = getUri(id);
  const uri = isCoinbaseWalletConnector(id)
    ? wcUri
    : wcUri
    ? selectedWallet?.getWalletConnectDeeplink?.(wcUri) ?? wcUri
    : undefined;

  const _locales = useLocales({
    CONNECTORNAME: selectedWallet?.name,
  });

  return (
    <PageContent style={{ width: isMobile ? 312 : 600 }}>
      <ConnectorWrapper>
        <ConnectorList walletsToDisplay={walletsToDisplay} />

        <ConnectContainer>
          <QRConnectContainer>
            <WalletNameContainer>
              <FitText>
                {selectedWallet?.shortName ?? selectedWallet?.name}
              </FitText>
            </WalletNameContainer>
            <CustomQRCodeContainer>
              <CustomQRCode
                value={uri}
                image={selectedWallet?.icon}
                tooltipMessage={
                  isWalletConnectConnector(id) ? (
                    <>
                      <ScanIconWithLogos />
                      <span>{_locales.scanScreen_tooltip_walletConnect}</span>
                    </>
                  ) : (
                    <>
                      <ScanIconWithLogos logo={selectedWallet?.icon} />
                      <span>{_locales.scanScreen_tooltip_default}</span>
                    </>
                  )
                }
              />
            </CustomQRCodeContainer>
            <OrContainer>OR</OrContainer>
            <Button
              arrow
              variant="primary"
              onClick={() => {
                context.setRoute(routes.CONNECT);
                context.setConnector({ id: context.selectedConnector.id });
              }}
            >
              Connect Now
            </Button>
          </QRConnectContainer>

          <LearnMoreContainer>
            <Button
              variant="secondary"
              onClick={() => context.setRoute(routes.ONBOARDING)}
            >
              <LearnMoreButton
                onClick={() => context.setRoute(routes.ONBOARDING)}
              >
                <WalletIcon /> {locales.connectorsScreen_newcomer}
              </LearnMoreButton>
            </Button>
          </LearnMoreContainer>
        </ConnectContainer>
      </ConnectorWrapper>

      {context.options?.disclaimer && (
        <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
          <div>{context.options?.disclaimer}</div>
        </Disclaimer>
      )}
    </PageContent>
  );
};

export default Wallets;
