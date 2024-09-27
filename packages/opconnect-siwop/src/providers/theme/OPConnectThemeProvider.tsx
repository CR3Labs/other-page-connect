import React, { createContext, createElement } from 'react';
import { CustomTheme, Mode, Theme } from '../../types';

type ContextValue = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  primaryColor?: string;
};

const Context = createContext<ContextValue | null>(null);

type OPConnectThemeProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  primaryColor?: string;
};

export const OPConnectThemeProvider: React.FC<OPConnectThemeProviderProps> = ({
  children,
  theme = 'auto',
  mode = 'auto',
  customTheme,
  primaryColor,
}) => {
  const value = {
    theme,
    mode,
    customTheme,
    primaryColor,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useThemeContext = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('OPConnectThemeProvider must be inside a Provider.');
  return context;
};
