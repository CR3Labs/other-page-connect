import defaultTheme from '../constants/defaultTheme';
import useIsMobile from './useIsMobile';
import useWindowSize from './useWindowSize';

export const useMobileView = () => {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();

  return isMobile || windowSize?.width <= defaultTheme.mobileWidth;
};
