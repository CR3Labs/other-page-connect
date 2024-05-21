import React, { useEffect, useState } from 'react';
import { useContext, routes } from '../../ConnectKit';

import {
  LearnMoreContainer,
  LearnMoreButton,
  ConnectorWrapper,
  ConnectContainer,
  QRConnectContainer,
  WalletNameContainer,
  CustomQRCodeContainer,
  OrContainer,
  ConnectorIcon,
} from './styles';
import { PageContent, Disclaimer } from '../../Common/Modal/styles';
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
import MobileConnectorListDropdown from '../../Common/ConnectorList/MobileConnectorListDropdown';
import { useMobileView } from '../../../hooks/useMobileView';

const DownChevron = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0002 13.672L16.9502 8.72205L18.3642 10.136L12.0002 16.5L5.63623 10.136L7.05023 8.72205L12.0002 13.672Z"
      fill="#060606"
    />
  </svg>
);

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const wallets = useWallets();
  const showMobileView = useMobileView();
  const isMobile = useIsMobile();
  const { lastConnectorId } = useLastConnector();
  const [isOpen, setIsOpen] = useState(false);

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

  let deeplink =
    !selectedWallet?.isInstalled && isMobile
      ? selectedWallet?.getWalletConnectDeeplink?.(uri ?? '')
      : undefined;

  const redirectToMoreWallets =
    isMobile && isWalletConnectConnector(selectedWallet?.id);
  if (redirectToMoreWallets) deeplink = undefined; // mobile redirects to more wallets page

  //needs to break at window width 660px
  //- on mobile dont show connector list
  //- show dropdown that allows user to select wallet

  return (
    <PageContent style={{ width: 600 }}>
      <ConnectorWrapper>
        {showMobileView ? null : (
          <ConnectorList walletsToDisplay={walletsToDisplay} />
        )}

        <ConnectContainer>
          <QRConnectContainer>
            {showMobileView ? (
              <MobileConnectorListDropdown
                open={isOpen || !showMobileView}
                onClose={() => setIsOpen(false)}
                offsetY={-20}
                walletsToDisplay={walletsToDisplay}
              >
                <Button
                  style={{
                    border: '1px solid #EAEDF0',
                    marginBottom: '12px',
                    background: 'white',
                    color: 'black',
                  }}
                  fullWidth={true}
                  onClick={() => setIsOpen(!isOpen)}
                  icon={<DownChevron />}
                  iconPosition="right"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      gap: '8px',
                    }}
                  >
                    {selectedWallet?.icon && (
                      <ConnectorIcon
                        data-small={selectedWallet.iconShouldShrink}
                        data-shape={selectedWallet.iconShape}
                        style={{ width: '16px', height: '16px' }}
                      >
                        {selectedWallet.iconConnector ?? selectedWallet.icon}
                      </ConnectorIcon>
                    )}
                    <FitText>
                      {selectedWallet?.shortName ?? selectedWallet?.name}
                    </FitText>
                  </div>
                </Button>
              </MobileConnectorListDropdown>
            ) : (
              <WalletNameContainer>
                <FitText>
                  {selectedWallet?.shortName ?? selectedWallet?.name}
                </FitText>
              </WalletNameContainer>
            )}
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
              style={{ minHeight: '45px' }}
              onClick={() => {
                //   if(deeplink){

                //   }
                //   context.setRoute(routes.CONNECT);
                //   context.setConnector({ id: context.selectedConnector.id });
                // }
                if (deeplink) {
                  window.location.href = deeplink;
                } else if (redirectToMoreWallets) {
                  context.setRoute(routes.MOBILECONNECTORS);
                } else {
                  context.setRoute(routes.CONNECT);
                  context.setConnector({ id: context.selectedConnector.id });
                }
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
