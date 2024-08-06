import { useContext, routes } from '../../OPConnect';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
} from './styles';

import { useWeb3 } from '../../contexts/web3';

import useIsMobile from '../../../hooks/useIsMobile';
import { ScrollArea } from '../ScrollArea';
import Alert from '../Alert';

import { WalletProps } from '../../../wallets/useWallets';
import {
  detectBrowser,
  isCoinbaseWalletConnector,
  isWalletConnectConnector,
} from '../../../utils';
import { useLastConnector } from '../../../hooks/useLastConnector';

const ConnectorList = ({
  walletsToDisplay,
  height,
}: {
  walletsToDisplay: WalletProps[];
  height?: number;
}) => {
  const context = useContext();

  const { lastConnectorId } = useLastConnector();

  return (
    <ScrollArea mobileDirection={'horizontal'} height={height}>
      {walletsToDisplay.length === 0 && (
        <Alert error>No connectors found in config.</Alert>
      )}
      {walletsToDisplay.length > 0 && (
        <ConnectorsContainer
          $mobile={false}
          $totalResults={walletsToDisplay.length}
        >
          {walletsToDisplay.map((wallet) => (
            <ConnectorItem
              key={wallet.id}
              wallet={wallet}
              isRecent={wallet.id === lastConnectorId}
              isSelected={wallet.id === context.selectedConnector.id}
            />
          ))}
        </ConnectorsContainer>
      )}
    </ScrollArea>
  );
};

export default ConnectorList;

export const ConnectorItem = ({
  wallet,
  isRecent,
  isSelected,
}: {
  wallet: WalletProps;
  isSelected?: boolean;
  isRecent?: boolean;
}) => {
  const {
    connect: { getUri },
  } = useWeb3();
  const uri = getUri();
  const isMobile = useIsMobile();
  const context = useContext();
  /*
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const provider = await wallet.connector.getProvider();
      setReady(!!provider);
    })();
  }, [wallet, setReady]);
  */

  let deeplink =
    !wallet.isInstalled && isMobile
      ? wallet.getWalletConnectDeeplink?.(uri ?? '')
      : undefined;

  const redirectToMoreWallets = isMobile && isWalletConnectConnector(wallet.id);

  // Safari requires opening popup on user gesture, so we connect immediately here
  const shouldConnectImmediately =
    (detectBrowser() === 'safari' || detectBrowser() === 'ios') &&
    isCoinbaseWalletConnector(wallet.connector.id);

  if (redirectToMoreWallets || shouldConnectImmediately) deeplink = undefined; // mobile redirects to more wallets page

  return (
    <ConnectorButton
      style={{
        background: isSelected ? 'var(--ck-primary-button-background)' : '',
        color: isSelected ? 'var(--ck-primary-button-hover-color)' : '',
        height: '45px',
      }}
      type="button"
      as={deeplink ? 'a' : undefined}
      href={deeplink ? deeplink : undefined}
      disabled={context.route !== routes.CONNECTORS}
      onClick={
        deeplink
          ? undefined
          : () => {
              if (redirectToMoreWallets) {
                context.setRoute(routes.MOBILECONNECTORS);
              } else if (wallet.id === 'walletConnect') {
                context.setRoute(routes.CONNECT);
                context.setConnector({ id: wallet.id });
              } else {
                context.setSelectedConnector({ id: wallet.id });
              }
            }
      }
    >
      <ConnectorIcon
        data-small={wallet.iconShouldShrink}
        data-shape={wallet.iconShape}
      >
        {wallet.iconConnector ?? wallet.icon}
      </ConnectorIcon>
      <ConnectorLabel>
        {isMobile ? wallet.shortName ?? wallet.name : wallet.name}
        {/* {!context.options?.hideRecentBadge && isRecent && (
          <RecentlyUsedTag>
            <span>Recent</span>
          </RecentlyUsedTag>
        )} */}
      </ConnectorLabel>
    </ConnectorButton>
  );
};
