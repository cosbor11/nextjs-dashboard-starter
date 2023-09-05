import { NextApiRequest } from 'next';

export const getBasePath = (req: NextApiRequest): string => {
  const host = req.headers.host;
  const isLocal = host?.includes('localhost');
  const protocol = isLocal ? 'http' : (req.headers['x-forwarded-proto'] as string) || 'https';
  return `${protocol}://${host}`;
};