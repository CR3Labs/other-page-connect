import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { routes, useContext } from '../OPConnect';
import { CustomTheme, Languages, Mode, Theme } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/About';
import Connectors from '../Pages/Connectors';
import MobileConnectors from '../Pages/MobileConnectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import SignInWithEthereum from '../Pages/SignInWithEthereum';

import { getAppIcon, getAppName } from '../../defaultConfig';
import { OPConnectThemeProvider } from '../OPConnectThemeProvider/OPConnectThemeProvider';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';
import OAuthWallet from '../Pages/OAuthWallet';
import SignInWithOtherPage from '../Pages/SignInWithOtherPage';
import { useSIWOP } from '@otherpage/connect-siwop';

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  mode?: Mode;
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
  primaryColor?: string;
}> = ({
  mode = 'auto',
  theme = 'auto',
  customTheme = customThemeDefault,
  lang = 'en-US',
  primaryColor,
}) => {
  const context = useContext();
  const { isConnected, chain } = useAccount();
  const chainIsSupported = useChainIsSupported(chain?.id);

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains &&
    isConnected &&
    !chainIsSupported
  );

  const showBackButton =
    closeable &&
    context.route !== routes.CONNECTORS &&
    context.route !== routes.PROFILE;

  const showInfoButton = closeable && context.route !== routes.PROFILE;

  const onBack = () => {
    if (context.route === routes.SIGNINWITHETHEREUM) {
      context.setRoute(routes.PROFILE);
    } if (context.route === routes.SIGNINWITHOTHERPAGE) {
      context.setRoute(routes.PROFILE);
    } else if (context.route === routes.SWITCHNETWORKS) {
      context.setRoute(routes.PROFILE);
    } else if (context.route === routes.DOWNLOAD) {
      context.setRoute(routes.CONNECT);
    } else {
      context.setRoute(routes.CONNECTORS);
    }
  };

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,
    download: <DownloadApp />,
    connectors: <Connectors />,
    mobileConnectors: <MobileConnectors />,
    connect: <ConnectUsing />,
    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
    signInWithEthereum: <SignInWithEthereum />,
    signInWithOtherPage: <SignInWithOtherPage />,
    oauthWallet: <OAuthWallet />,
  };

  function hide() {
    context.setOpen(false);
  }

  useEffect(() => {
    if (context.signInWithOtherPage && window.location.search.includes('code')) {
      context.setOpen(true);
      context.setRoute(routes.SIGNINWITHOTHERPAGE);
      return;
    }

    if (isConnected) {
      if (
        context.route !== routes.PROFILE ||
        context.route !== routes.SIGNINWITHETHEREUM ||
        context.route !== routes.SIGNINWITHOTHERPAGE
      ) {
        if (
          context.signInWithEthereum &&
          !context.options?.disableSiweRedirect
        ) {
          context.setRoute(routes.SIGNINWITHETHEREUM);
        } 
        else if (context.signInWithOtherPage) {
          context.setRoute(routes.SIGNINWITHOTHERPAGE);
        } 
        else {
          hide(); // Hide on connect
        }
      }
    } else {
      hide(); // Hide on connect
    }
  }, [isConnected]);

  useEffect(() => context.setMode(mode), [mode]);
  useEffect(() => context.setTheme(theme), [theme]);
  useEffect(() => context.setCustomTheme(customTheme), [customTheme]);
  useEffect(() => context.setLang(lang), [lang]);

  /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
  useEffect(() => {
    const appName = getAppName();
    if (!appName || !context.open) return;

    const title = document.createElement('meta');
    title.setAttribute('property', 'og:title');
    title.setAttribute('content', appName);
    document.head.prepend(title);

    /*
    // TODO:  When pulling data into WalletConnect, figure out which icon gets used and replace with appIcon if available 
    const appIcon = getAppIcon();
    const icon = document.createElement('link');
    if (appIcon) {
      icon.setAttribute('rel', 'icon');
      icon.setAttribute('href', appIcon);
      document.head.prepend(icon);
    }*/

    return () => {
      document.head.removeChild(title);
      //if (appIcon) document.head.removeChild(icon);
    };
  }, [context.open]);

  return (
    <OPConnectThemeProvider
      theme={theme}
      customTheme={customTheme}
      mode={mode}
      primaryColor={primaryColor}
    >
      <Modal
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={closeable ? hide : undefined}
        onInfo={
          showInfoButton ? () => context.setRoute(routes.ABOUT) : undefined
        }
        onBack={showBackButton ? onBack : undefined}
      />
    </OPConnectThemeProvider>
  );
};

export default ConnectModal;
