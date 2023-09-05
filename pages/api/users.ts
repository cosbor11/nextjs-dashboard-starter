import admin from '@/src/firebase/firebase-admin-app';
import { NextApiRequest, NextApiResponse } from 'next';

const usersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { me } = req.query;

  if (me === 'true') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;
      
      const userRecord = await admin.auth().getUser(uid);

      // Extract relevant user's data
      const user = {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        phoneNumber: userRecord.phoneNumber,
        disabled: userRecord.disabled,
      };

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(400).json({ error: 'Bad Request' });
};

export default usersHandler;
