import Button from '../Button';
import { ResetContainer } from '../../styles';
import useIsMounted from '../../hooks/useIsMounted';
import useLocales from '../../hooks/useLocales';
import { SIWOPSession, useSIWOP } from '../../providers/siwop';
import Logos from '../../assets/logos';

type ButtonProps = {
  mode?: 'light' | 'dark' | 'auto';
  showAvatar?: boolean;
  showSignOutButton?: boolean;
  onSignIn?: (data?: SIWOPSession) => any; // TODO type the idToken
  onSignOut?: () => void;
};

export const SiwopButtonRender: React.FC<ButtonProps> = ({
  mode,
  showSignOutButton,
  showAvatar,
  onSignIn,
  onSignOut,
}) => {
  const isMounted = useIsMounted();
  // TODO configurable locale?
  const locales = useLocales('en-US');

  const {
    isSignedIn,
    isReady,
    isLoading,
    isRejected,
    isSuccess,
    isError,
    signIn,
    signOut,
    error,
    data,
  } = useSIWOP({
    onSignIn: (data) => onSignIn?.(data),
    onSignOut: () => onSignOut?.(),
  });

  function getButtonLabel() {
    if (isSuccess) return locales.signedIn;
    if (isLoading) return locales.redirecting;
    if (isRejected) return locales.tryAgain;
    if (isError) return error ?? 'Unknown Error';
    if (isReady) return locales.signIn;
    return locales.signIn;
  }

  if (!isMounted) {
    return <Button key="loading" style={{ margin: 0 }} disabled />;
  }

  if (showSignOutButton && isSignedIn) {
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={signOut}
        // icon={<DisconnectIcon />}
        icon={
          showAvatar && (
          data?.picture ? 
            <img src={data?.picture} style={{ borderRadius: '100%' }} /> :
            <Logos.OtherPage />
          )
        }
      >
        {locales.signOut}
      </Button>
    );
  }

  return (
    <Button
      key="button"
      style={{ margin: 0 }}
      // arrow={!isSignedIn ? !isLoading && !isRejected : false}
      onClick={!isLoading && !isSuccess ? signIn : undefined}
      disabled={isLoading}
      waiting={isLoading}
      icon={<Logos.OtherPage />}
      // icon={
      //   isRejected && (
      //     <motion.div
      //       initial={{
      //         rotate: -270,
      //       }}
      //       animate={{
      //         rotate: 0,
      //       }}
      //       transition={{
      //         duration: 1,
      //         ease: [0.175, 0.885, 0.32, 0.98],
      //       }}
      //     >
      //       <RetryIcon style={{ opacity: 0.4 }} />
      //     </motion.div>
      //   )
      // }
    >
      {getButtonLabel()}
    </Button>
  );
};

export const SiwopButtonComponent: React.FC<ButtonProps> = ({ ...props }) => (
  <ResetContainer
    $useMode={props.mode}
  >
    <SiwopButtonRender {...props} />
  </ResetContainer>
);
export default SiwopButtonComponent;
