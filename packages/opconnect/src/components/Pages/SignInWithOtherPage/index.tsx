import React from 'react';

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
import { useSIWOP } from '@otherpage/connect-siwop';

import { TickIcon } from '../../../assets/icons';
import Avatar from '../../Common/Avatar';

import { AnimatePresence, motion } from 'framer-motion';
import { flattenChildren, isMobile } from '../../../utils';
import useLocales from '../../../hooks/useLocales';
import Logos from '../../../assets/logos';
import Button from '../../Common/Button';
import { SiwopButton } from '@otherpage/connect-siwop';
import FitText from '../../Common/FitText';
import { ImageContainer } from '../../Common/Avatar/styles';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from '../../OPConnect';

const transition = { duration: 0.2, ease: [0.26, 0.08, 0.25, 1] };
const copyTransition = { duration: 0.16, ease: [0.26, 0.08, 0.25, 1] };

const SignInWithOtherPage: React.FC = () => {
  const context = useContext();
  const queryClient = useQueryClient();
  const { clientId, appUrl, isSignedIn, error, data } = useSIWOP();
  const mobile = isMobile();
  const { address } = useAccount();
  const locales = useLocales({});
  const copy = {
    heading: locales.signInWithOtherPageScreen_signedOut_heading,
    h1: locales.signInWithOtherPageScreen_signedOut_h1,
    p: locales.signInWithOtherPageScreen_signedOut_p,
    button: locales.signInWithOtherPageScreen_signedOut_button,
  };

  // TODO custom button component?
  const openAccount = () => {
    const left = (window.innerWidth / 2) - 400;
    const top = (window.innerHeight / 2) - 380;
    const win = window.open(`${appUrl}/connect/settings?client_id=${clientId}`, "mozillaWindow", `left=${left},top=${top},width=800,height=760`)
    var timer = setInterval(function() { 
      if(win?.closed) {
        clearInterval(timer);
        queryClient.refetchQueries({
          queryKey: ['siwopSession'],
          type: 'active',
          exact: true,
        })
      }
    }, 500);
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
            key="image"
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
              {data?.image ? (
                <ImageContainer src={data?.image} alt="avatar" $loaded={true} />
              ) : (
                <Avatar address={data?.wallet || address} width={64} height={64} />
              )}
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
          {!isSignedIn && (
            <ContentContainer>
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
                    <FitText style={{ display: 'block' }}>{error ? 'Error occured' : copy.p}</FitText>
                  </ModalBody>
                </motion.div>
              </AnimatePresence>
            </ContentContainer>
          )}
          {isSignedIn && (
            <Button
              onClick={openAccount}
            >
              Account Settings
            </Button>
          )}
          <SiwopButton
            showSignOutButton={isSignedIn}
            mode={context.mode}
            address={address}
          />
        </ModalBody>
      </ModalContent>
    </PageContent>
  );
};

export default SignInWithOtherPage;
