import {
  OAuthConnectorButton,
  OAuthConnectorIcon,
  OAuthConnectorLabel,
} from './styles';
import { routes, useContext } from '../../OPConnect';
import { ScrollArea } from '../ScrollArea';
import { OAuthConnectorContainer } from './styles';
import { WalletProps } from '../../../wallets/useWallets';
import { useSmartWallets } from '../../../wallets/useSmartWallets';
import Alert from '../Alert';

export const OAuthList = () => {
  const smartWallets = useSmartWallets();

  return (
    <ScrollArea height={450}>
      {smartWallets?.length === 0 && (
        <Alert error>No smart wallet connectors found in config.</Alert>
      )}
      {smartWallets?.length > 0 && (
        <OAuthConnectorContainer
          $mobile={false}
          $totalResults={smartWallets?.length}
        >
          {smartWallets?.map((wallet, idx) => (
            <OAuthConnectorItem key={idx} wallet={wallet} />
          ))}
        </OAuthConnectorContainer>
      )}
    </ScrollArea>
  );
};

const OAuthConnectorItem = ({ wallet }: { wallet: WalletProps }) => {
  const context = useContext();

  return (
    <OAuthConnectorButton
      style={{
        height: '45px',
      }}
      type="button"
      disabled={context.route !== routes.OAUTHWALLET}
      onClick={() => {
        context.setRoute(routes.CONNECT);
        context.setConnector({ id: wallet.id });
      }}
    >
      <OAuthConnectorIcon data-small={false}>
        {wallet.iconConnector ?? wallet.icon}
      </OAuthConnectorIcon>
      <OAuthConnectorLabel>
        {wallet.name === 'Coinbase Wallet' ? 'Smart Wallet' : wallet.name}
      </OAuthConnectorLabel>
    </OAuthConnectorButton>
  );
};
