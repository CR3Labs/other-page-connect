import { useMemo } from 'react';
import { oauthConfigs } from './oauthConfigs';

export const useOAuthProviders = () => {
  const otherProviders = useMemo(() => {
    return Object.values(oauthConfigs).filter(
      (config) => config.type === 'other'
    );
  }, []);
  const socialProviders = useMemo(() => {
    return Object.values(oauthConfigs).filter(
      (config) => config.type === 'social'
    );
  }, []);

  return { otherProviders, socialProviders };
};
