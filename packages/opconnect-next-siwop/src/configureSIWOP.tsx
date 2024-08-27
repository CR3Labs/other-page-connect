import { FunctionComponent, ComponentProps } from 'react';
import { SIWOPProvider } from '@otherpage/connect';
import type { IncomingMessage, ServerResponse } from 'http';
import { getIronSession, IronSession, IronSessionOptions } from 'iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  generateSiweNonce,
} from 'viem/siwe';
import { generatePKCE, jwtDecode, JwtPayload } from './util';


const API_URL = 'https://alpha-api.other.page/v1';

type RouteHandlerOptions = {
  afterNonce?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWOPSession<{}>
  ) => Promise<void>;
  afterPKCE?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWOPSession<{}>
  ) => Promise<void>;
  afterToken?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWOPSession<{}>,
    token: NextServerSIWOPToken,
  ) => Promise<void>;
  afterSession?: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: NextSIWOPSession<{}>
  ) => Promise<void>;
  afterLogout?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

type NextServerSIWOPToken = {
  decoded_access_token: JwtPayload;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

type NextServerSIWOPConfig = {
  config: {
    authApiUrl?: string;
    audience?: string;
    clientId?: string;
    redirectUri?: string;
    clientSecret?: string;
    scope?: string;
  };
  session?: Partial<IronSessionOptions>;
  options?: RouteHandlerOptions;
};

type NextClientSIWOPConfig = {
  appUrl?: string;
  apiRoutePrefix: string;
  clientId: string;
  redirectUri: string;
  scope: string;
};

type NextSIWOPSession<TSessionData extends Object = {}> = IronSession &
  TSessionData & {
    codeVerifier?: string;
    codeChallenge?: string;
    nonce?: string;
    address?: string;
    avatar?: string;
    chainId?: number;
    uid?: string;
    avatarName?: string;
    avatarImage?: string;
    avatarTokenId?: string;
    avatarContract?: string;
    avatarChainId?: string;
  };

type NextSIWOPProviderProps = Omit<
  ComponentProps<typeof SIWOPProvider>,
  | 'authApiUrl'
  | 'clientId'
  | 'redirectUri'
  | 'scope'
  | 'getNonce'
  | 'generatePKCE'
  | 'createAuthorizationUrl'
  | 'verifyCode'
  | 'getSession'
  | 'signOut'
  | 'data'
  | 'signIn'
  | 'status'
  | 'resetStatus'
>;

type ConfigureServerSIWOPResult<TSessionData extends Object = {}> = {
  apiRouteHandler: NextApiHandler;
  getSession: (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<NextSIWOPSession<TSessionData>>;
};

type ConfigureClientSIWOPResult<TSessionData extends Object = {}> = {
  Provider: FunctionComponent<NextSIWOPProviderProps>;
};

const getAccount = async (
  accessToken: string,
  config: NextServerSIWOPConfig['config']
) => {
  // Perform the POST request to the external API
  const response = await fetch(`${config.authApiUrl}/account`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch account data');
  }

  return response.json();
}

const getSession = async <TSessionData extends Object = {}>(
  req: IncomingMessage,
  res: any, // ServerResponse<IncomingMessage>,
  sessionConfig: IronSessionOptions
) => {
  const session = (await getIronSession(
    req,
    res,
    sessionConfig
  )) as NextSIWOPSession<TSessionData>;
  return session;
};

const logoutRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<void>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterLogout']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      session.destroy();
      if (afterCallback) {
        await afterCallback(req, res);
      }
      res.status(200).end();
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const nonceRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<string>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterNonce']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      if (!session.nonce) {
        session.nonce = generateSiweNonce();
        await session.save();
      }
      if (afterCallback) {
        await afterCallback(req, res, session);
      }
      res.send(session.nonce);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const pkceRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<{ codeChallenge?: string }>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterPKCE']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      if (!session.codeVerifier) {
        const { codeChallenge, codeVerifier } = await generatePKCE();
        session.codeVerifier = codeVerifier;
        session.codeChallenge = codeChallenge;
        await session.save();
      }
      if (afterCallback) {
        await afterCallback(req, res, session);
      }
      res.send({ codeChallenge: session.codeChallenge });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const sessionRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<{ address?: string; uid?: string, chainId?: number }>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterSession']
) => {
  switch (req.method) {
    case 'GET':
      const session = await getSession(req, res, sessionConfig);
      
      if (afterCallback) {
        await afterCallback(req, res, session);
      }
      res.send(session);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const verifyCodeRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<void>,
  sessionConfig: IronSessionOptions,
  config: NextServerSIWOPConfig['config'],
  afterCallback?: RouteHandlerOptions['afterToken']
) => {
  switch (req.method) {
    case 'POST':
      try {
        // fetch current session
        const session = await getSession(req, res, sessionConfig);

        // fetch access token
        const response = await fetch(`${config?.authApiUrl}/connect/oauth2-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code: req.body.code,
            code_verifier: session.codeVerifier,
            aud: config?.audience,
            client_id: config?.clientId,
            client_secret: config?.clientSecret,
            redirect_uri: config?.redirectUri,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to retrieve access token');
        }

        const data = await response.json();
        if (!data.access_token) {
          return res.status(422).end('Unable to fetch access token.');
        }

        // persist session data
        const decoded = jwtDecode(data.access_token);
        session.address = decoded.addr;
        session.avatar = decoded.avatar;
        session.uid = decoded.sub;

        // fetch avatar image/name
        const account = await getAccount(data.access_token, config);
        if (account) {
          // TODO once account level usernames are available
          // session.username = account.username;
          if (account.connectedAvatar) {
            session.avatarName = account.connectedAvatar.name;
            session.avatarImage = account.connectedAvatar.token.image;
            session.avatarTokenId = account.connectedAvatar.token.tokenId;
            session.avatarContract = account.connectedAvatar.token.contract;
            session.avatarChainId = account.connectedAvatar.token.chainId;
          }
        }

        await session.save();
        
        if (afterCallback) {
          await afterCallback(req, res, session, {
            ...data,
            decoded_access_token: decoded,
          });
        }
        res.status(200).end();
      } catch (error) {
        res.status(400).end(String(error));
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const envVar = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const configureServerSideSIWOP = <TSessionData extends Object = {}>({
  config,
  session: { cookieName, password, cookieOptions, ...otherSessionOptions } = {},
  options: { afterNonce, afterToken, afterSession, afterLogout } = {},
}: NextServerSIWOPConfig): ConfigureServerSIWOPResult<TSessionData> => {

  config.authApiUrl = config.authApiUrl || API_URL;

  const sessionConfig: IronSessionOptions = {
    cookieName: cookieName ?? 'opconnect-next-siwop',
    password: password ?? envVar('SESSION_SECRET'),
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      ...(cookieOptions ?? {}),
    },
    ...otherSessionOptions,
  };

  const apiRouteHandler: NextApiHandler = async (req, res) => {
    if (!(req.query.route instanceof Array)) {
      throw new Error(
        'Catch-all query param `route` not found. SIWOP API page should be named `[...route].ts` and within your `pages/api` directory.'
      );
    }

    const route = req.query.route.join('/');
    switch (route) {
      case 'nonce':
        return await nonceRoute(req, res, sessionConfig, afterNonce);
      case 'pkce':
        return await pkceRoute(req, res, sessionConfig, afterNonce);
      case 'verify':
        return await verifyCodeRoute(req, res, sessionConfig, config, afterToken);
      case 'session':
        return await sessionRoute(req, res, sessionConfig, afterSession);
      case 'logout':
        return await logoutRoute(req, res, sessionConfig, afterLogout);
      default:
        return res.status(404).end();
    }
  };

  return {
    apiRouteHandler,
    getSession: async (req: IncomingMessage, res: ServerResponse) =>
      await getSession<TSessionData>(req, res, sessionConfig),
  };
};

export const configureClientSIWOP = <TSessionData extends Object = {}>({
  apiRoutePrefix,
  clientId,
  redirectUri,
  scope,
}: NextClientSIWOPConfig): ConfigureClientSIWOPResult<TSessionData> => {
  const NextSIWOPProvider = (props: NextSIWOPProviderProps) => {
    return (
      <SIWOPProvider
        clientId={clientId}
        redirectUri={redirectUri}
        scope={scope}
        getNonce={async () => {
          const res = await fetch(`${apiRoutePrefix}/nonce`);
          if (!res.ok) {
            throw new Error('Failed to fetch SIWOP nonce');
          }
          const nonce = await res.text();
          return nonce;
        }}
        generatePKCE={async () => {
          const res = await fetch(`${apiRoutePrefix}/pkce`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) {
            throw new Error('Failed to generate PKCE');
          }
          return res.json();
        }}
        createAuthorizationUrl={({ appUrl, nonce, address, code_challenge }) =>
          `${appUrl}/connect?client_id=${clientId}&scope=${scope.replace(' ', '+')}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}&wallet=${address}&code_challenge=${code_challenge}&code_challenge_method=S256`
        }
        verifyCode={({ code }) =>
          fetch(`${apiRoutePrefix}/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          }).then((r) => r.ok)
        }
        getSession={async () => {
          const res = await fetch(`${apiRoutePrefix}/session`);
          if (!res.ok) {
            throw new Error('Failed to fetch SIWOP session');
          }
          const {
            nonce,
            address,
            chainId,
            uid,
            avatar,
            avatarChainId,
            avatarContract,
            avatarImage,
            avatarName,
            avatarTokenId,
          } = await res.json();
          return address ? { 
            nonce,
            address,
            chainId,
            uid,
            avatar,
            avatarChainId,
            avatarContract,
            avatarImage,
            avatarName,
            avatarTokenId, 
          } : null;
        }}
        signOut={() => fetch(`${apiRoutePrefix}/logout`).then((res) => res.ok)}
        {...props}
      />
    );
  };

  return {
    Provider: NextSIWOPProvider,
  };
};
