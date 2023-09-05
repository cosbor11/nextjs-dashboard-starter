import type { NextApiRequest, NextApiResponse } from 'next';
import firebaseDb from '@/src/firebase/firebase-db';
import admin from '@/src/firebase/firebase-admin-app';

const updatePasswordHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    console.error(`unsuported request method: ${req.method}`)
    return res.status(405).end();
  }
  let docRef = null;
  let email = null;
  const { password, resetCode } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      email = decodedToken.email
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({"error": {"message": "Failed authentication"}});
    }
    if (!email){
      console.error('Token is missing email');
      return res.status(401).json({"error": {"message": "Failed authentication"}});
    }
  } else if (!resetCode) {
    return res.status(400).json(`{"error": {"message": "Authentication or Reset code is required."}}`);
  } else {
    const codesRef = firebaseDb.collection('resetCodes');
    docRef = codesRef.doc(resetCode);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({"error": {"message": "Invalid reset code."}});
    }

    const data = doc.data();
    if (!data) {
      await docRef.delete();
      return res.status(400).json({ error: { message: 'Invalid reset code.' } });
    }

    const expiresAt = new Date(data.expiresAt);
    const now = new Date();

    if (now > expiresAt) {
      try {
        if (docRef) {
          await docRef.delete(); // delete because it is expired
        }
      } catch (error) {
        console.error(`failed to delete firebase record: ${error}`)
      }
      return res.status(400).json({ error: { message: 'Reset code is expired. You wil need resend ahtoner password reset' } });
    }

    email = data.email
  }

  if (!password) {
    return res.status(400).send(`{"error": {"message": "Password is required."}}`);
  }

  try {
    console.log(`retreiving user: ${email}...`)
    const userRecord = await admin.auth().getUserByEmail(email);

    console.log(`updating password user: ${email}...`)
    const response = await admin.auth().updateUser(userRecord.uid, {
      password,
    });
    
    try {
      if (docRef) {
        await docRef.delete(); //can only be used one time
      }
    } catch (error) {
      console.error(`failed to delete firebase record: ${error}`)
    }

    return res.status(200).send(`{"message": "success"}`);
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: error });
  }

};

export default updatePasswordHandler;