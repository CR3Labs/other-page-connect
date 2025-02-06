import { NextApiRequest, NextApiResponse } from 'next';

import { siwopServer } from '@/utils/siwopServer';

/**
 * This is an example of a protected route that can only be accessed 
 * if the user is logged in via Sign in With Other Page (SIWOP).
 * 
 * @param req
 * @param res
 * @returns
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'GET') {
    const session = await siwopServer.getSession(req, res);

    if (!session?.accessToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // perform a protected action here

    res.status(200).send('OK');
  }
}