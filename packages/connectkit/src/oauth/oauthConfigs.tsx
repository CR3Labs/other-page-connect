import Logos from '../assets/oauthLogos';

export type IOAuthConfig = {
  name: string;
  shortName: string;
  icon: React.ReactNode;
  type: 'social' | 'other';
  //@TODO && @DEV - placeholder object to show options until fleshed out
};

export const oauthConfigs: { [id: string]: IOAuthConfig } = {
  discord: {
    name: 'Discord',
    shortName: 'Discord',
    icon: <Logos.Discord />,
    type: 'social',
  },
  email: {
    name: 'Email Address',
    shortName: 'Email',
    icon: <Logos.Email />,
    type: 'other',
  },
  facebook: {
    name: 'Facebook',
    shortName: 'Facebook',
    icon: <Logos.Facebook />,
    type: 'social',
  },
  github: {
    name: 'GitHub',
    shortName: 'GitHub',
    icon: <Logos.GitHub />,
    type: 'social',
  },
  googleAuthenticator: {
    name: 'Google Authenticator',
    shortName: 'Google',
    icon: <Logos.GoogleAuthenticator />,
    type: 'other',
  },
  google: {
    name: 'Google',
    shortName: 'Google',
    icon: <Logos.Google />,
    type: 'social',
  },
  linkedIn: {
    name: 'LinkedIn',
    shortName: 'LinkedIn',
    icon: <Logos.LinkedIn />,
    type: 'social',
  },
  phone: {
    name: 'Phone Number',
    shortName: 'Phone',
    icon: <Logos.Phone />,
    type: 'other',
  },
};
