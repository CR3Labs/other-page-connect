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
import { useSIWOP } from '../../../siwop';

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
import Button from '../../Common/Button';
import { SIWOPButton } from '../../Standard/SIWOP';

const transition = { duration: 0.2, ease: [0.26, 0.08, 0.25, 1] };
// const copyTransition = { duration: 0.16, ease: [0.26, 0.08, 0.25, 1] };

const SignInWithOtherPage: React.FC = () => {
  const { clientId, isSignedIn } = useSIWOP();
  const mobile = isMobile();

  const [status, setStatus] = useState<'signedOut' | 'signedIn'>(
    isSignedIn ? 'signedIn' : 'signedOut'
  );

  const locales = useLocales({});
  const copy =
    status === 'signedIn'
      ? {
          heading: locales.signInWithOtherPageScreen_signedIn_heading,
          h1: locales.signInWithOtherPageScreen_signedIn_h1,
          p: locales.signInWithOtherPageScreen_signedIn_p,
          button: locales.signInWithOtherPageScreen_signedIn_button,
        }
      : {
          heading: locales.signInWithOtherPageScreen_signedOut_heading,
          h1: locales.signInWithOtherPageScreen_signedOut_h1,
          p: locales.signInWithOtherPageScreen_signedOut_p,
          button: locales.signInWithOtherPageScreen_signedOut_button,
        };

  useEffect(() => {
    if (isSignedIn) {
      setStatus('signedIn');
    } else {
      setStatus('signedOut');
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) setStatus('signedOut');
  }, []);

  const { address } = useAccount();

  // TODO custom button component?
  const openAccount = () => {
    const left = (window.innerWidth / 2) - 400;
    const top = (window.innerHeight / 2) - 380;
    // TODO domain from Context
    window.open(`http://127.0.0.1:3001/connect/settings?client_id=${clientId}`, "mozillaWindow", `left=${left},top=${top},width=800,height=760`)
  };

  return (
    <PageContent style={{ width: 290 }}>
      <ModalContent style={{ padding: 0, marginTop: 10 }}>
        <StatusGraphic $connected={isSignedIn} key="status">
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
        <ModalBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '0px 16px',
          }}
        >
          {isSignedIn && (
            <Button
              onClick={openAccount}
            >
              Account Settings
            </Button>
          )}
          <SIWOPButton
            showSignOutButton={status === 'signedIn'}
          />
        </ModalBody>
      </ModalContent>
    </PageContent>
  );
};

export default SignInWithOtherPage;
