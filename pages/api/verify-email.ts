import admin from '@/src/firebase/firebase-admin-app';
import { NextApiRequest, NextApiResponse } from 'next';

const verifyEmailHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;

  try {
    body = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { email } = body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: {message: 'Email is required'} });
  }

  try {
    const response = await admin.auth().getUserByEmail(email);
    return res.status(200).json({ exists: true });
  } catch (error:any) {
    if ( error.code && error.code === 'auth/user-not-found') {
      return res.status(200).json({ exists: false });
    }

    return res.status(500).json({ error: {message: error.message } });
  }
};

export default verifyEmailHandler;