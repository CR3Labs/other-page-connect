import { FunctionComponent, ComponentProps } from 'react';
import { SIWOPProvider } from '@otherpage/connect-siwop';
import type { IncomingMessage, ServerResponse } from 'http';
import { getIronSession, IronSession, IronSessionOptions } from 'iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  generateSiweNonce,
} from 'viem/siwe';
import { generatePKCE, jwtDecode } from './util';

const API_URL = 'https://api.other.page/v1';

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
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  id_token?: string;
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
    codeChallenge?: string;
    nonce?: string;
    account?: any; // TODO type this?

    // server-side only
    codeVerifier?: string;
    accessToken?: string; 
    refreshToken?: string;
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
  refreshSession: (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<NextSIWOPSession<TSessionData>>;
  getAccount: (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<any>;
};

type ConfigureClientSIWOPResult<TSessionData extends Object = {}> = {
  Provider: FunctionComponent<NextSIWOPProviderProps>;
};

const getAccount = async (
  accessToken: string,
  config: NextServerSIWOPConfig['config'],
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
    throw new Error('Session expired');
  }

  return response.json(); 
}

const refreshToken = async (
  session: NextSIWOPSession<{}>,
  config: NextServerSIWOPConfig['config'],
) => {

  try {
    const response = await fetch(`${config.authApiUrl}/connect/token`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.NEXT_PUBLIC_SIWOP_CLIENT_ID,
        client_secret: process.env.SIWOP_CLIENT_SECRET,
        refresh_token: session.refreshToken,
        scope: config.scope,
      }),
    });

    if (!response.ok) {
      return null;
    }
    
    // persist refreshed access token and refresh token
    const tokens = await response.json();

    session.accessToken = tokens.access_token;
    session.refreshToken = tokens.refresh_token;
    await session.save();

    return tokens;
  } catch (error) {
    console.error(error);
    return null;
  }
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

  const tokens = (await getIronSession(
    req,
    res,
    {
      ...sessionConfig,
      cookieName: sessionConfig.cookieName + '_t',
    }
  )) as NextSIWOPSession<TSessionData>;

  return {
    session,
    tokens,
  };
};

const destroySession = async (
  req: IncomingMessage,
  res: any, // ServerResponse<IncomingMessage>,
  sessionConfig: IronSessionOptions
) => {
  const { session, tokens } = await getSession(req, res, sessionConfig);
  session?.destroy();
  tokens?.destroy();
};

// ---- routes ---- //

const logoutRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<void>,
  sessionConfig: IronSessionOptions,
  afterCallback?: RouteHandlerOptions['afterLogout']
) => {
  switch (req.method) {
    case 'GET':
      // TODO revoke token
      await destroySession(req, res, sessionConfig);

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
      const { session } = await getSession(req, res, sessionConfig);
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
      const { session } = await getSession(req, res, sessionConfig);
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
  res: NextApiResponse<Partial<NextSIWOPSession>>,
  sessionConfig: IronSessionOptions,
  config: NextServerSIWOPConfig['config'],
  afterCallback?: RouteHandlerOptions['afterSession']
) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return res.end();
  }

    const { session, tokens } = await getSession(req, res, sessionConfig);

    if (!session) {
      res.status(401).end();
    }

    if (!tokens?.accessToken) {
      return res.send({
        nonce: session.nonce
      });
    }

    // retrieve account to ensure session is still vaild
    try {
      const { sub, adr, scope } = jwtDecode(tokens.accessToken);
      let account = { sub, wallet: adr };
      if (scope?.includes('openid')) {
        // try to fetch account
        // NOTE: will throw if access_token is expired
        account = await getAccount(tokens.accessToken, config);
        
      } else {
        // TODO: use introspection endpoint if not openid 
        // scope to make sure the token is still valid
      }

      if (afterCallback) {
        await afterCallback(req, res, { ...session, ...tokens, account });
      }
      
      res.send({
        nonce: session.nonce,
        account,
      });
    } catch (error) {
      // attempt to refresh the token
      if (!req.query.retry && tokens.refreshToken) {
        req.query.retry = '1';
        const refreshedTokens = await refreshToken(tokens, config);
        if (refreshedTokens) {
          return sessionRoute(req, res, sessionConfig, config, afterCallback);
        }
        await destroySession(req, res, sessionConfig);
      }
      console.error(error);
      res.status(401).end();
    }
};

const verifyCodeRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<{ account?: any, idToken?: string | undefined; error?: string; }>,
  sessionConfig: IronSessionOptions,
  config: NextServerSIWOPConfig['config'],
  afterCallback?: RouteHandlerOptions['afterToken']
) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({error: `Method ${req.method} Not Allowed` });
    return res.end();
  }

  try {
    // fetch current session data
    const { session, tokens } = await getSession(req, res, sessionConfig);

    // fetch access token
    const response = await fetch(`${config?.authApiUrl}/connect/token`, {
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
      return res.status(401).json({ error: 'Failed to fetch access token.' });
    }

    const data = await response.json();

    if (!data.access_token) {
      return res.status(422).json({ error: 'Unable to fetch access token.' });
    }

    // persist session data
    delete session.codeChallenge;
    delete session.codeVerifier;
    tokens.accessToken = data.access_token;
    tokens.refreshToken = data.refresh_token;
    await session.save();
    await tokens.save();
    
    if (afterCallback) {
      await afterCallback(req, res, session, {
        ...data,
      });
    }
    const { sub, adr } = jwtDecode(data.id_token);
    const acc = { sub, wallet: adr, exp: 0, iat: 0, iss: '', aud: '', nonce: '' };
    const { exp, iat, iss, aud, nonce, ...account } = data.id_token ? jwtDecode(data.id_token) : acc;
    
    if (data.id_token) {
      // TODO because we are using an authorization code flow
      // its relatively safe to reuse the nonce here for the id_token, if  
      // future support for an implicit flow is added we will want to generate 
      // a separate nonce for the id_token and never expose it to the client
      const n = 'oidc'+session?.nonce?.substring(2,30)
      if (n !== nonce) {
        return res.status(401).json({ error: 'Invalid id_token nonce' });
      }
    }

    res.send({ account, idToken: data.id_token });
  } catch (error) {
    console.error(error);
    res.status(400).end(String(error));
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
    cookieName: cookieName ?? '_opc',
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
        return await sessionRoute(req, res, sessionConfig, config, afterSession);
      case 'logout':
        return await logoutRoute(req, res, sessionConfig, afterLogout);
      default:
        return res.status(404).end();
    }
  };

  return {
    apiRouteHandler,
    getSession: async (req: IncomingMessage, res: ServerResponse) => {
      const { session, tokens } = await getSession<TSessionData>(req, res, sessionConfig);

      return {
        ...session,
        ...tokens,
      };
    },
    refreshSession: async (req: IncomingMessage, res: ServerResponse) => {
      const { session, tokens } = await getSession<TSessionData>(req, res, sessionConfig);

      if (!tokens?.refreshToken) {
        throw new Error(`Session invalid or did not include 'offline_access' scope`);
      }
      
      const refreshedTokens = await refreshToken(tokens, config);
      if (!refreshedTokens) {
        throw new Error('Session refresh token no longer valid');
      }

      return {
        ...session,
        ...tokens,
      };
    },
    getAccount: async (req: IncomingMessage, res: ServerResponse) => {
      const { tokens } = await getSession<TSessionData>(req, res, sessionConfig);

      if (!tokens?.accessToken) {
        throw new Error('Session invalid');
      }

      return getAccount(tokens.accessToken, config);
    }
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
        createAuthorizationUrl={({ appUrl, nonce, address, code_challenge, prompt }) =>
          `${appUrl}/connect?client_id=${clientId}&scope=${scope.replace(' ', '+')}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}&nonce=${'oidc'+nonce.substring(2,30)}&code_challenge=${code_challenge}&code_challenge_method=S256${address ? `&wallet=${address}` : ''}${prompt ? `&prompt=${prompt}` : ''}`
        }
        verifyCode={({ code }) =>
          fetch(`${apiRoutePrefix}/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          }).then((r) => r.json())
        }
        getSession={async () => {
          const res = await fetch(`${apiRoutePrefix}/session`);
          if (!res.ok) {
            throw new Error('Failed to fetch SIWOP session');
          }
          const {
            nonce,
            account,
          } = await res.json();
          return account ? { 
            nonce,
            account,
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
