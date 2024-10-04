import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, Variants } from 'framer-motion';

import { ResetContainer } from '../../../styles';
import Portal from '../Portal';

import {
  flattenChildren,
  isWalletConnectConnector,
  isMobile,
} from '../../../utils';

import {
  Container,
  BoxContainer,
  ModalContainer,
  PageContainer,
  PageContents,
  ControllerContainer,
  InnerContainer,
  BackgroundOverlay,
  CloseButton,
  BackButton,
  InfoButton,
  ModalHeading,
  TextWithHr,
  ErrorMessage,
  DisclaimerBackground,
  Disclaimer,
  SiweButton,
  SignInTooltip,
  ConnectedIndicator,
  ModalFooter,
  PoweredByContainer,
} from './styles';

import { routes, useContext } from '../../OPConnect';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';

import { useTransition } from 'react-transition-state';
import FocusTrap from '../../../hooks/useFocusTrap';
import usePrevious from '../../../hooks/usePrevious';
import { CustomTheme } from '../../../types';
import { useThemeContext } from '../../OPConnectThemeProvider/OPConnectThemeProvider';
import { useAccount, useSwitchChain } from 'wagmi';
import { AuthIcon } from '../../../assets/icons';
import { useSIWE } from '../../../siwe';
import useLocales from '../../../hooks/useLocales';
import FitText from '../FitText';
import { useWallet } from '../../../wallets/useWallets';
import { useMobileView } from '../../../hooks/useMobileView';
import { PoweredByOtherPage } from '../../../assets/logos';
import { useSIWOP } from '@otherpage/connect-siwop';

const ProfileIcon = ({ isSignedIn }: { isSignedIn?: boolean }) => (
  <div style={{ position: 'relative' }}>
    {isSignedIn && (
      <AuthIcon
        style={{
          bottom: -1,
          right: -1,
        }}
      />
    )}
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM5.013 16.256C6.42855 17.3877 8.18768 18.0029 10 18C11.97 18 13.773 17.288 15.167 16.108C14.5157 15.4397 13.7371 14.9089 12.877 14.5468C12.017 14.1847 11.0931 13.9988 10.16 14C9.19259 13.9989 8.2355 14.1989 7.34947 14.5872C6.46343 14.9756 5.66778 15.5439 5.013 16.256ZM3.616 14.82C4.45645 13.9281 5.47067 13.2177 6.59614 12.7327C7.72161 12.2477 8.93448 11.9984 10.16 12C11.3417 11.9985 12.512 12.2304 13.6037 12.6824C14.6955 13.1344 15.6873 13.7976 16.522 14.634C17.3781 13.4291 17.8836 12.0106 17.9826 10.5359C18.0815 9.06119 17.77 7.58789 17.0825 6.27946C16.395 4.97102 15.3585 3.87862 14.088 3.12345C12.8174 2.36827 11.3625 1.97984 9.8846 2.00125C8.40672 2.02267 6.96366 2.45308 5.71552 3.24476C4.46738 4.03643 3.46296 5.1584 2.81369 6.4862C2.16442 7.814 1.89569 9.29571 2.03732 10.7669C2.17894 12.2382 2.72537 13.6414 3.616 14.821V14.82ZM10 11C8.93913 11 7.92172 10.5786 7.17157 9.82843C6.42143 9.07828 6 8.06087 6 7C6 5.93913 6.42143 4.92172 7.17157 4.17157C7.92172 3.42143 8.93913 3 10 3C11.0609 3 12.0783 3.42143 12.8284 4.17157C13.5786 4.92172 14 5.93913 14 7C14 8.06087 13.5786 9.07828 12.8284 9.82843C12.0783 10.5786 11.0609 11 10 11ZM10 9C10.5304 9 11.0391 8.78929 11.4142 8.41421C11.7893 8.03914 12 7.53043 12 7C12 6.46957 11.7893 5.96086 11.4142 5.58579C11.0391 5.21071 10.5304 5 10 5C9.46957 5 8.96086 5.21071 8.58579 5.58579C8.21071 5.96086 8 6.46957 8 7C8 7.53043 8.21071 8.03914 8.58579 8.41421C8.96086 8.78929 9.46957 9 10 9Z"
        fill="currentColor"
      />
    </svg>
  </div>
);
const InfoIcon = ({ ...props }) => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z"
      fill="currentColor"
    />
  </svg>
);
const CloseIcon = ({ ...props }) => (
  <motion.svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1_728)">
      <path
        d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.04999 18.364L5.63599 16.95L10.586 12L5.63599 7.05L7.04999 5.636L12 10.586Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_728">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </motion.svg>
);
const BackIcon = ({ ...props }) => (
  <motion.svg
    width={9}
    height={16}
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 1L1 8L8 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const contentTransitionDuration = 0.22;

export const contentVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: contentTransitionDuration * 0.75,
      delay: contentTransitionDuration * 0.25,
      ease: [0.26, 0.08, 0.25, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    left: ['50%', '50%'],
    x: ['-50%', '-50%'],
    transition: {
      duration: contentTransitionDuration,
      ease: [0.26, 0.08, 0.25, 1],
    },
  },
};

type ModalProps = {
  open?: boolean;
  pages: any;
  pageId: string;
  positionInside?: boolean;
  inline?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onInfo?: () => void;

  demo?: {
    theme: string;
    mode?: string;
    customTheme: CustomTheme;
  };
};
const Modal: React.FC<ModalProps> = ({
  open,
  pages,
  pageId,
  positionInside,
  inline,
  demo,
  onClose,
  onBack,
  onInfo,
}) => {
  const context = useContext();
  const themeContext = useThemeContext();
  const mobile = isMobile();
  const { isSignedIn: isSignedInEth, reset } = useSIWE();
  const { isSignedIn: isSignedInOp } = useSIWOP();
  const isSignedIn = isSignedInEth || isSignedInOp;

  const wallet = useWallet(context.connector?.id);

  const walletInfo = {
    name: wallet?.name,
    shortName: wallet?.shortName ?? wallet?.name,
    icon: wallet?.iconConnector ?? wallet?.icon,
    iconShape: wallet?.iconShape ?? 'circle',
    iconShouldShrink: wallet?.iconShouldShrink,
  };

  const locales = useLocales({
    CONNECTORNAME: walletInfo?.name,
  });

  const [state, setOpen] = useTransition({
    timeout: mobile ? 200 : 200, // different animations, 10ms extra to avoid final-frame drops
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
  });
  const mounted = !(state === 'exited' || state === 'unmounted');
  const rendered = state === 'preEnter' || state !== 'exiting';
  const currentDepth =
    context.route === routes.CONNECTORS
      ? 0
      : context.route === routes.DOWNLOAD
      ? 2
      : 1;
  const prevDepth = usePrevious(currentDepth, currentDepth);
  if (!positionInside) useLockBodyScroll(mounted);

  const prevPage = usePrevious(pageId, pageId);

  useEffect(() => {
    setOpen(open);
    if (open) setInTransition(undefined);
  }, [open]);

  const [dimensions, setDimensions] = useState<{
    width: string | undefined;
    height: string | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  const [inTransition, setInTransition] = useState<boolean | undefined>(
    undefined
  );

  // Calculate new content bounds
  const updateBounds = (node: any) => {
    const bounds = {
      width: node?.offsetWidth,
      height: node?.offsetHeight,
    };
    setDimensions({
      width: `${bounds?.width}px`,
      height: `${bounds?.height}px`,
    });
  };

  let blockTimeout: ReturnType<typeof setTimeout>;
  const contentRef = useCallback(
    (node: any) => {
      if (!node) return;
      ref.current = node;

      // Avoid transition mixups
      setInTransition(inTransition === undefined ? false : true);
      clearTimeout(blockTimeout);
      blockTimeout = setTimeout(() => setInTransition(false), 360);

      // Calculate new content bounds
      updateBounds(node);
    },
    [open, inTransition]
  );

  // Update layout on chain/network switch to avoid clipping
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const showMobile = useMobileView();

  const ref = useRef<any>(null);
  useEffect(() => {
    if (ref.current) updateBounds(ref.current);
  }, [
    chain,
    switchChain,
    showMobile,
    mobile,
    isSignedIn,
    context.options,
    context.resize,
  ]);

  useEffect(() => {
    if (!mounted) {
      setDimensions({
        width: undefined,
        height: undefined,
      });
      return;
    }

    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [mounted, onClose]);

  const dimensionsCSS = {
    '--height': dimensions.height,
    '--width': dimensions.width,
  } as React.CSSProperties;

  function shouldUseQrcode() {
    if (!wallet) return false; // Fail states are shown in the injector flow

    const useInjector = !wallet.getWalletConnectDeeplink || wallet.isInstalled;
    return !useInjector;
  }

  function getHeading() {
    switch (context.route) {
      case routes.ABOUT:
        return locales.aboutScreen_heading;
      case routes.CONNECT:
        if (shouldUseQrcode()) {
          return isWalletConnectConnector(wallet?.connector?.id)
            ? locales.scanScreen_heading
            : locales.scanScreen_heading_withConnector;
        } else {
          return walletInfo?.name;
        }
      case routes.CONNECTORS:
        return locales.connectorsScreen_heading;
      case routes.MOBILECONNECTORS:
        return locales.mobileConnectorsScreen_heading;
      case routes.DOWNLOAD:
        return locales.downloadAppScreen_heading;
      case routes.ONBOARDING:
        return locales.onboardingScreen_heading;
      case routes.PROFILE:
        return (
          <>
            <ConnectedIndicator />
            {locales.profileScreen_heading}
          </>
        );
      case routes.SWITCHNETWORKS:
        return locales.switchNetworkScreen_heading;
      case routes.SIGNINWITHETHEREUM:
        return isSignedIn
          ? locales.signInWithEthereumScreen_signedIn_heading
          : locales.signInWithEthereumScreen_signedOut_heading;
      case routes.SIGNINWITHOTHERPAGE:
        return isSignedIn
          ? locales.signInWithOtherPageScreen_signedIn_heading
          : locales.signInWithOtherPageScreen_signedOut_heading;
      case routes.OAUTHWALLET:
        return locales.signInWithEthereumScreen_signedOut_button;
      default:
        return '';
    }
  }

  const Content = (
    <ResetContainer
      $useTheme={demo?.theme ?? themeContext.theme}
      $useMode={demo?.mode ?? themeContext.mode}
      $customTheme={demo?.customTheme ?? themeContext.customTheme}
      $primaryColor={themeContext.primaryColor ?? context.primaryColor}
    >
      <ModalContainer
        role="dialog"
        style={{
          pointerEvents: rendered ? 'auto' : 'none',
          position: positionInside ? 'absolute' : undefined,
        }}
      >
        {!inline && (
          <BackgroundOverlay
            $active={rendered}
            onClick={onClose}
            $blur={context.options?.overlayBlur}
          />
        )}
        <Container
          style={{ ...dimensionsCSS }}
          initial={false}
          // transition={{
          //   ease: [0.2555, 0.1111, 0.2555, 1.0001],
          //   duration: !positionInside && state !== 'entered' ? 0 : 0.24,
          // }}
        >
          <div
            style={{
              pointerEvents: inTransition ? 'all' : 'none', // Block interaction while transitioning
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'var(--width)',
              zIndex: 9,
              transition: 'width 200ms ease',
            }}
          />
          <BoxContainer className={`${rendered && 'active'}`}>
            <AnimatePresence initial={false}>
              {context.options?.disclaimer &&
                context.route === routes.CONNECTORS && (
                  <DisclaimerBackground
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      delay: 0,
                      duration: 0.2,
                      ease: [0.25, 0.1, 0.25, 1.0],
                    }}
                  >
                    <Disclaimer>
                      <div>{context.options?.disclaimer}</div>
                    </Disclaimer>
                  </DisclaimerBackground>
                )}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {context.errorMessage && (
                <ErrorMessage
                  initial={{ y: '10%', x: '-50%' }}
                  animate={{ y: '-100%' }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <span>{context.errorMessage}</span>
                  <div
                    onClick={() => context.displayError(null)}
                    style={{
                      position: 'absolute',
                      right: 24,
                      top: 24,
                      cursor: 'pointer',
                    }}
                  >
                    <CloseIcon />
                  </div>
                </ErrorMessage>
              )}
            </AnimatePresence>
            <ControllerContainer>
              {onClose && (
                <CloseButton
                  aria-label={flattenChildren(locales.close).toString()}
                  onClick={onClose}
                >
                  <CloseIcon />
                </CloseButton>
              )}
              <div
                style={{
                  position: 'absolute',
                  top: 21,
                  right: 60,
                  width: 32,
                  height: 32,
                }}
              >
                <AnimatePresence>
                  {onBack ? (
                    <BackButton
                      disabled={inTransition}
                      aria-label={flattenChildren(locales.back).toString()}
                      key="backButton"
                      onClick={onBack}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: mobile ? 0 : 0.1,
                        delay: mobile ? 0.01 : 0,
                      }}
                    >
                      <BackIcon />
                    </BackButton>
                  ) : context.route === routes.PROFILE &&
                    context.signInWithEthereum ? (
                    <SiweButton
                      disabled={inTransition}
                      aria-label={
                        locales.signInWithEthereumScreen_signedOut_heading
                      }
                      key="siweButton"
                      onClick={() => {
                        reset();
                        context.setRoute(routes.SIGNINWITHETHEREUM);
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: mobile ? 0 : 0.1,
                        delay: mobile ? 0.01 : 0,
                      }}
                    >
                      <ProfileIcon isSignedIn={isSignedIn} />
                    </SiweButton>
                  ) : context.route === routes.PROFILE &&
                  context.signInWithOtherPage ? (
                  <SiweButton
                    disabled={inTransition}
                    aria-label={
                      locales.signInWithOtherPageScreen_signedOut_heading
                    }
                    key="siwopButton"
                    onClick={() => {
                      reset();
                      context.setRoute(routes.SIGNINWITHOTHERPAGE);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: mobile ? 0 : 0.1,
                      delay: mobile ? 0.01 : 0,
                    }}
                  >
                    <ProfileIcon isSignedIn={isSignedIn} />
                  </SiweButton>
                ) : (
                    onInfo &&
                    !context.options?.hideQuestionMarkCTA && (
                      <InfoButton
                        disabled={inTransition}
                        aria-label={flattenChildren(
                          locales.moreInformation
                        ).toString()}
                        key="infoButton"
                        onClick={onInfo}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: mobile ? 0 : 0.1,
                          delay: mobile ? 0.01 : 0,
                        }}
                      >
                        <InfoIcon />
                      </InfoButton>
                    )
                  )}
                </AnimatePresence>
              </div>
            </ControllerContainer>

            <ModalHeading>
              <AnimatePresence>
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 24,
                    right: 24,
                    display: 'flex',
                    //alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  key={`${context.route}-${isSignedIn ? 'signedIn' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: mobile ? 0 : 0.17,
                    delay: mobile ? 0.01 : 0,
                  }}
                >
                  <FitText>{getHeading()}</FitText>
                </motion.div>
              </AnimatePresence>
            </ModalHeading>

            <InnerContainer>
              {Object.keys(pages).map((key) => {
                const page = pages[key];
                return (
                  // TODO: We may need to use the follow check avoid unnecessary computations, but this causes a bug where the content flashes
                  // (key === pageId || key === prevPage) && (
                  <Page
                    key={key}
                    open={key === pageId}
                    initial={!positionInside && state !== 'entered'}
                    enterAnim={
                      key === pageId
                        ? currentDepth > prevDepth
                          ? 'active-scale-up'
                          : 'active'
                        : ''
                    }
                    exitAnim={
                      key !== pageId
                        ? currentDepth < prevDepth
                          ? 'exit-scale-down'
                          : 'exit'
                        : ''
                    }
                  >
                    <PageContents
                      key={`inner-${key}`}
                      ref={contentRef}
                      style={{
                        pointerEvents:
                          key === pageId && rendered ? 'auto' : 'none',
                      }}
                    >
                      {page}
                    </PageContents>
                  </Page>
                );
              })}
              <ModalFooter>
                <PoweredByContainer>
                  <PoweredByOtherPage />
                </PoweredByContainer>
              </ModalFooter>
            </InnerContainer>
          </BoxContainer>
        </Container>
      </ModalContainer>
    </ResetContainer>
  );
  return (
    <>
      {mounted && (
        <>
          {positionInside ? (
            Content
          ) : (
            <>
              {
                <Portal>
                  <FocusTrap>{Content}</FocusTrap>
                </Portal>
              }
            </>
          )}
        </>
      )}
    </>
  );
};

type PageProps = {
  children?: React.ReactNode;
  open?: boolean;
  initial: boolean;
  prevDepth?: number;
  currentDepth?: number;
  enterAnim?: string;
  exitAnim?: string;
};

const Page: React.FC<PageProps> = ({
  children,
  open,
  initial,
  prevDepth,
  currentDepth,
  enterAnim,
  exitAnim,
}) => {
  const [state, setOpen] = useTransition({
    timeout: 400,
    preEnter: true,
    initialEntered: open,
    mountOnEnter: true,
    unmountOnExit: true,
  });
  const mounted = !(state === 'exited' || state === 'unmounted');
  const rendered = state === 'preEnter' || state !== 'exiting';

  useEffect(() => {
    setOpen(open);
  }, [open]);

  if (!mounted) return null;

  return (
    <PageContainer
      className={`${rendered ? enterAnim : exitAnim}`}
      style={{
        animationDuration: initial ? '0ms' : undefined,
        animationDelay: initial ? '0ms' : undefined,
      }}
    >
      {children}
    </PageContainer>
  );
};

export const OrDivider = ({ children }: { children?: React.ReactNode }) => {
  const locales = useLocales();
  return (
    <TextWithHr>
      <span>{children ?? locales.or}</span>
    </TextWithHr>
  );
};

export default Modal;
