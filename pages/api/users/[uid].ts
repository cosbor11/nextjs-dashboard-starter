import { NextApiRequest, NextApiResponse } from 'next';
import { getBasePath } from '@/src/request-helpers';
import admin from '@/src/firebase/firebase-admin-app';

const isValidPhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

const convertToE164 = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const length = cleaned.length;

  if (length === 10) {
    return '+1' + cleaned;
  } else if (length > 10) {
    return '+' + cleaned;
  } else {
    return cleaned;
  }
};

const handlePatch = async (req: NextApiRequest, uid: string, res: NextApiResponse) => {
  const { phoneNumber } = req.body;

  if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({ error: { message: 'Invalid phone number' } });
  }
  req.body.phoneNumber = phoneNumber ? convertToE164(phoneNumber) : undefined;

  if (req.body.photoURL && !req.body.photoURL.startsWith('http')) {
    const baseUrl = getBasePath(req);
    req.body.photoURL = `${baseUrl}${req.body.photoURL}`;
  }

  try {
    await admin.auth().updateUser(uid, req.body);
    const updatedUser = await admin.auth().getUser(uid);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(400).json({ error });
  }
};

const handleDelete = async (uid: string, res: NextApiResponse) => {
  try {
    await admin.auth().deleteUser(uid);
    return res.status(201).json("user delete request sent");
  } catch (error) {
    console.error(`Error deleting user ${uid}`, error);
    return res.status(500).json({ error: { message: "Internal Service Error. Please try again later." } });
  }
};

const usersByUIDHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).end();
  }
  
  const { uid } = req.query;

  if (Array.isArray(uid)) {
    return res.status(400).json({ error: { message: 'UID must be a provided in the url' } });
  }

  if (uid) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let tokenUID = "";
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      tokenUID = decodedToken.uid;
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: { message: 'Unauthorized: Invalid or expired token' } });
    }

    if (uid !== tokenUID) {
      return res.status(403).json({ error: { message: "Forbidden: you do not have permissions to modify this resource" } });
    }

    if (req.method === 'PATCH') {
      return handlePatch(req, uid as string, res);
    }

    if (req.method === 'DELETE') {
      return handleDelete(uid as string, res);
    }
  }
};

export default usersByUIDHandler;
