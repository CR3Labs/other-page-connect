import React, {
  createContext,
  createElement,
  useEffect,
  useState,
} from 'react';
import { Types } from 'opconnect';

type ContextValue = {
  theme: Types.Theme;
  setTheme: React.Dispatch<React.SetStateAction<Types.Theme>>;
  customTheme: Types.CustomTheme;
  setCustomTheme: React.Dispatch<React.SetStateAction<Types.CustomTheme>>;
  mode: Types.Mode;
  setMode: React.Dispatch<React.SetStateAction<Types.Mode>>;
  options: Types.OPConnectOptions;
  setOptions: React.Dispatch<React.SetStateAction<Types.OPConnectOptions>>;
  hideBalance: boolean;
  setHideBalance: React.Dispatch<React.SetStateAction<boolean>>;
  hideAvatar: boolean;
  setHideAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  ckPrimaryColor: `#${string}`;
};

const Context = createContext<ContextValue | null>(null);

type TestBenchProviderProps = {
  children?: React.ReactNode;
  theme?: Types.Theme;
  customTheme?: Types.CustomTheme;
  mode?: Types.Mode;
  options?: Types.OPConnectOptions;
  primaryColor?: `#${string}`;
};

const theme = 'auto';

export const TestBenchProvider: React.FC<TestBenchProviderProps> = ({
  children,
  customTheme = {},
  // primaryColor = '#F97316',
  primaryColor = '#123d17',
  mode = 'dark',
  options = {
    overlayBlur: 0,
    language: 'en-US',
    hideTooltips: false,
    hideQuestionMarkCTA: true,
    hideNoWalletCTA: false,
    avoidLayoutShift: true,
    embedGoogleFonts: true,
    truncateLongENSAddress: true,
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
    walletConnectCTA: 'link',
    showOAuthConnectors: true,
    //enforceSupportedChains: false,
    //initialChainId: 0,
  },
}) => {
  const [ckPrimaryColor, setPrimaryColor] =
    useState<`#${string}`>(primaryColor);
  const [ckCustomTheme, setCustomTheme] = useState<Types.Theme>(customTheme);
  const [ckTheme, setTheme] = useState<Types.CustomTheme>(theme);
  const [ckMode, setMode] = useState<Types.Mode>(mode);
  const [ckOptions, setOptions] = useState<Types.OPConnectOptions>(options);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [hideAvatar, setHideAvatar] = useState<boolean>(false);
  const [label, setLabel] = useState<string | undefined>();

  useEffect(() => setTheme(theme), []);

  const value: any = {
    theme: ckTheme,
    ckPrimaryColor,
    setTheme,
    customTheme: ckCustomTheme,
    setCustomTheme,
    mode: ckMode,
    setMode,
    options: ckOptions,
    setOptions,
    hideBalance,
    setHideBalance,
    hideAvatar,
    setHideAvatar,
    label,
    setLabel,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useTestBench = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('TestBenchProvider must be inside a Provider.');
  return context;
};
