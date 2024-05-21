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
  DesktopConnectContainer,
  DontSeeWalletButton,
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

const InfoIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    id="i-dont-see-my-wallet"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z"
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

  const walletConnect = walletsToDisplay.find(
    (wallet) => wallet.id === 'walletConnect'
  );

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

  return (
    <PageContent style={{ width: 600 }}>
      <ConnectorWrapper>
        {showMobileView ? null : (
          <DesktopConnectContainer>
            <ConnectorList walletsToDisplay={walletsToDisplay} />
            <LearnMoreContainer>
              <Button
                variant="secondary"
                style={{ border: 'none' }}
                onClick={() => {
                  if (walletConnect) {
                    context.setRoute(routes.CONNECT);
                    context.setConnector({ id: walletConnect?.id });
                  } else {
                    context.setRoute(routes.ONBOARDING);
                  }
                }}
              >
                <DontSeeWalletButton
                  onClick={() => {
                    if (walletConnect) {
                      context.setRoute(routes.CONNECT);
                      context.setConnector({ id: walletConnect?.id });
                    } else {
                      context.setRoute(routes.ONBOARDING);
                    }
                  }}
                >
                  <div style={{ width: '22px', height: '22px' }}>
                    <InfoIcon />{' '}
                  </div>
                  {"I don't see my wallet"}
                </DontSeeWalletButton>
              </Button>
            </LearnMoreContainer>
          </DesktopConnectContainer>
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
