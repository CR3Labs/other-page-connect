import { useOAuthProviders } from '../../../oauth/useOAuthProviders';
import {
  OAuthConnectorButton,
  OAuthConnectorIcon,
  OAuthConnectorLabel,
} from './styles';
import useIsMobile from '../../../hooks/useIsMobile';
import { routes, useContext } from '../../OPConnect';
import { IOAuthConfig } from '../../../oauth/oauthConfigs';
import { ScrollArea } from '../ScrollArea';
import { OAuthConnectorContainer } from './styles';

export const OAuthList = () => {
  const { otherProviders, socialProviders } = useOAuthProviders();

  return (
    <ScrollArea height={450}>
      <OAuthConnectorContainer
        $mobile={false}
        $totalResults={otherProviders.length + socialProviders.length}
      >
        {otherProviders.map((oauthConnector) => (
          <OAuthConnectorItem
            key={oauthConnector.name}
            oauthConnector={oauthConnector}
          />
        ))}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              background:
                'var(--ck-body-divider-secondary,var(--ck-body-divider)',
              width: '100%',
              height: '1px',
            }}
          />
          <p
            style={{
              textTransform: 'uppercase',
              color: 'var(--ck-connector-button-color)',
              fontSize: '10px',
              textAlign: 'left',
            }}
          >
            Socials
          </p>
        </div>

        {socialProviders.map((oauthConnector) => (
          <OAuthConnectorItem
            key={oauthConnector.name}
            oauthConnector={oauthConnector}
          />
        ))}
      </OAuthConnectorContainer>
    </ScrollArea>
  );
};

const OAuthConnectorItem = ({
  oauthConnector,
}: {
  oauthConnector: IOAuthConfig;
}) => {
  const isMobile = useIsMobile();
  const context = useContext();

  return (
    <OAuthConnectorButton
      style={{
        height: '45px',
      }}
      type="button"
      // as={externalLink ? 'a' : undefined}
      // href={externalLink ? externalLink : undefined}
      disabled={context.route !== routes.OAUTHWALLET}
      onClick={() => alert(`OAuth Connector ${oauthConnector.name} Clicked`)}
    >
      <OAuthConnectorIcon data-small={false}>
        {oauthConnector.icon}
      </OAuthConnectorIcon>
      <OAuthConnectorLabel>
        {isMobile ? oauthConnector.shortName : oauthConnector.name}
      </OAuthConnectorLabel>
    </OAuthConnectorButton>
  );
};
