import firebaseDb from '@/src/firebase/firebase-db';
import type { NextApiRequest, NextApiResponse } from 'next';

const verifyRegistrationCodeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, code } = JSON.parse(req.body);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!code) {
    return res.status(400).json({ message: 'code is required' });
  }

  try {

    const codesRef = firebaseDb.collection('registrationCodes');
    const docRef = codesRef.doc(email)
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: {message: 'Registration code not found' }});
    }

    const storedCode = doc.data()?.code;

    if (storedCode !== code) {
      return res.status(400).json({ error:{message: 'Invalid registration code'} });
    }

    const data = doc.data();
    if (!data) {
      await docRef.delete();
      return res.status(400).json({ error: { message: 'Invalid reset code.' } });
    } else {
      try {
        if (docRef) {
          await docRef.delete(); // delete because it is expired
        }
      } catch (error) {
        console.error(`failed to delete firebase record: ${error}`)
      }
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error verifying registration code:', error);
    return res.status(500).json({ "error": error});
  }
};

export default verifyRegistrationCodeHandler