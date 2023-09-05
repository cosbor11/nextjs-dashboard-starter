import { NextApiRequest, NextApiResponse } from 'next';
import { getBasePath } from '@/src/request-helpers';
import admin from '@/src/firebase/firebase-admin-app';

type User = {
    profileImageUrl: string;
    email: string;
    givenName: string;
    familyName: string;
    confirmedPassword: string;
};

const validateUser = (profile: User) => {
    const missingFields = [];
    
    for (const [key, value] of Object.entries(profile)) {
        if (!value) {
            missingFields.push(key);
        }
    }

    if (missingFields.length > 0) {
        throw new Error(JSON.stringify({ error: { message: `The following fields are missing: ${missingFields.join(', ')}.` } }));
    }

    if (!profile.email.match(/^\S+@\S+\.\S+$/)) {
        throw new Error(JSON.stringify({ error: { message: 'Email is not in the correct format.' } }));
    }
};

const registerHandler =  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const baseUrl = getBasePath(req)
        const user: User = req.body;
        validateUser(user);

        // Check if profileImageUrl is a relative link, and prepend the domain if necessary
        if (user.profileImageUrl && !user.profileImageUrl.startsWith('http')) {
            user.profileImageUrl = `${baseUrl}${user.profileImageUrl}`;
        }

        const createUserRequest = {
            email: user.email,
            emailVerified: true,
            password: user.confirmedPassword,
            displayName: `${user.givenName} ${user.familyName}`,
            photoURL: user.profileImageUrl,
            disabled: false,
        }

        const userRecord = await admin.auth().createUser(createUserRequest);
        console.log(`Created new user: ${userRecord.uid}`);
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        return res.status(201).json({ userId: userRecord.uid, token: customToken });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(400).json({ error: error });
    }
};

export default registerHandler
