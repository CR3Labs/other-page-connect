import React, { useEffect, useState } from 'react';

import { useContext } from '../../OPConnect';

import {
  PageContent,
  ModalBody,
  ModalContent,
} from '../../Common/Modal/styles';
import {
  StatusGraphic,
  LogoContainer,
  StatusIcon,
  StatusGraphicBgSvg,
  ContentContainer,
} from './styles';

import { useAccount } from 'wagmi';
import { SIWEButton } from '../../Standard/SIWE';
import { useSIWE } from '../../../siwe';

import { TickIcon } from '../../../assets/icons';
import Chains from '../../../assets/chains';
import Avatar from '../../Common/Avatar';
import { getAppIcon } from '../../../defaultConfig';

import { AnimatePresence, motion } from 'framer-motion';
import LazyImage from '../../Common/LazyImage';
import { isMobile, flattenChildren } from '../../../utils';
import useLocales from '../../../hooks/useLocales';
import FitText from '../../Common/FitText';
import Logos from '../../../assets/logos';

const transition = { duration: 0.2, ease: [0.26, 0.08, 0.25, 1] };
const copyTransition = { duration: 0.16, ease: [0.26, 0.08, 0.25, 1] };

const SignInWithOtherPage: React.FC = () => {
  const context = useContext();
  const { isSignedIn, reset } = useSIWE();
  const { address: connectedAddress } = useAccount();
  const mobile = isMobile();

  const [status, setStatus] = useState<'signedOut' | 'signedIn'>(
    isSignedIn ? 'signedIn' : 'signedOut'
  );

  const locales = useLocales({});
  const copy =
    status === 'signedIn'
      ? {
          heading: locales.signInWithEthereumScreen_signedIn_heading,
          h1: locales.signInWithEthereumScreen_signedIn_h1,
          p: locales.signInWithEthereumScreen_signedIn_p,
          button: locales.signInWithEthereumScreen_signedIn_button,
        }
      : {
          heading: locales.signInWithEthereumScreen_signedOut_heading,
          h1: locales.signInWithEthereumScreen_signedOut_h1,
          p: locales.signInWithEthereumScreen_signedOut_p,
          button: locales.signInWithEthereumScreen_signedOut_button,
        };

  useEffect(() => {
    if(window.location.search.includes('code')) {
      setStatus('signedIn');
      // TODO pass code to API for validation
      setTimeout(() => context.setOpen(false), 2000);
    } else {
      const clientId = '019f608c-04c6-4568-b4d1-8e6ee24789b2';
      const oauth = `client_id=${clientId}&response_type=code&redirect_uri=http://127.0.0.1:3004&scope=avatar.read+wallets.read+twitter.read+discord.read+tokens.read+communities.read&state=random-cookie&code_challenge=ok_XaQvFqt2mVvGtiZOv2bwDU3tZg09_ebzmtG_77FI&code_challenge_method=S256&wallet=${connectedAddress}`
     setTimeout(() => window.location.href = encodeURI(`http://127.0.0.1:3001/connect?${oauth}`), 2000);
    }
  }, []);

  // useEffect(() => {
  //   if (!isSignedIn) {
  //     setStatus('signedOut');
  //   }
  // }, [isSignedIn]);

  const { address } = useAccount();

  // We use the favicon for the dApp logo because that's how the connectors do it
  // TODO: Allow for dev customisation
  const getFavicons = () => {
    const favicons: { svg: string | null; default: string | null } = {
      svg: null,
      default: null,
    };
    const nodeList: HTMLCollectionOf<HTMLLinkElement> =
      document.getElementsByTagName('link');
    Array.from(nodeList).forEach((node) => {
      if (
        (node.getAttribute('rel') === 'icon' ||
          node.getAttribute('rel') === 'shortcut icon') &&
        node.getAttribute('href')
      ) {
        if (node.getAttribute('type') === 'image/svg+xml') {
          favicons.svg = node.getAttribute('href');
        } else {
          favicons.default = node.getAttribute('href');
        }
      }
    });
    return favicons;
  };
  const favicons = getFavicons();
  const favicon = getAppIcon() ?? favicons.svg ?? favicons.default;

  console.log(status);

  return (
    <PageContent style={{ width: 290 }}>
      <ModalContent style={{ padding: 0, marginTop: 10 }}>
        <StatusGraphic $connected={status == 'signedIn'} key="status">
          <div style={{ position: 'absolute', inset: 0 }}>
            <StatusGraphicBgSvg
              width="262"
              height="134"
              viewBox="0 0 262 134"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.rect
                x="0"
                y="0"
                rx="12"
                width="262"
                height="134"
                strokeDasharray="3 3"
                animate={{
                  strokeDashoffset: [0, -6],
                }}
                transition={{
                  duration: 0.4,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            </StatusGraphicBgSvg>
          </div>

          <motion.div
            key="avatarImage"
            initial={
              mobile
                ? false
                : {
                    opacity: 0,
                    x: 50,
                    scale: 0.8,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={transition}
          >
            <LogoContainer>
              <Avatar address={address} width={64} height={64} />
            </LogoContainer>
          </motion.div>
          <motion.div
            key="tickIcon"
            initial={
              mobile
                ? false
                : {
                    scale: 0.6,
                  }
            }
            animate={{
              scale: 1,
            }}
            transition={{
              ...transition,
            }}
          >
            <StatusIcon>
              {/* {status == 'signedIn' && <TickIcon style={{ color: '#22c55e', opacity: 1 }} />} */}
              <TickIcon />
            </StatusIcon>
          </motion.div>
          <motion.div
            key="appLogo"
            initial={
              mobile
                ? false
                : {
                    opacity: 0,
                    x: -40,
                    scale: 0.8,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              ...transition,
            }}
          >
            <LogoContainer>
              <Logos.OtherPage />
              {/* @DEV @TODO - Ask client if we want a hardcoded OtherPage Logo here, or the reg. favicon */}
              {/* {favicon ? (
                <LazyImage src={favicon} alt={'app'} />
              ) : (
                <Chains.UnknownChain />
              )} */}
            </LogoContainer>
          </motion.div>
        </StatusGraphic>
        {/* <ContentContainer>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={flattenChildren(copy.h1).toString()}
              initial={mobile ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={copyTransition}
            >
              <ModalBody
                style={{
                  height: 38,
                  fontWeight: 700,
                  justifyContent: 'flex-start',
                  display: 'flex',
                  fontSize: '24px',
                  marginBottom: 8,
                  textAlign: 'left',
                }}
              >
                <FitText>{copy.h1}</FitText>
              </ModalBody>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={flattenChildren(copy.p).toString()}
              style={{ paddingBottom: mobile ? 24 : 12, width: '100%' }}
              initial={mobile ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={copyTransition}
            >
              <ModalBody
                style={{
                  height: 42,
                  marginTop: -1,
                  marginBottom: -3,
                  justifyContent: 'start',
                  display: 'flex',
                  textAlign: 'left',
                  width: '100%',
                  minWidth: '100%',
                }}
              >
                <FitText style={{ display: 'block' }}>{copy.p}</FitText>
              </ModalBody>
            </motion.div>
          </AnimatePresence>
        </ContentContainer> */}

        {/* <SIWEButton
          showSignOutButton={status === 'signedIn'}
          onSignIn={() => {
            setTimeout(() => {
              context.setOpen(false);
            }, 1000);
          }}
        /> */}
      </ModalContent>
    </PageContent>
  );
};

export default SignInWithOtherPage;
