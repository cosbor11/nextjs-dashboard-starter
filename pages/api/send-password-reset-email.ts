import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import firebaseDb from '@/src/firebase/firebase-db';
import crypto from 'crypto';
import { getBasePath } from '@/src/request-helpers';
import Branding from '@/components/branding/Branding';
import admin from '@/src/firebase/firebase-admin-app';


const generateRandomString = (length: number): string => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toLocaleUpperCase()
};

const sendPasswordResetEmailHandler =  async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = req.body;

  // Validate email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: { message: 'A valid email is required.' } });
  }

  // Check if user is disabled or doesn't exist
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    if (userRecord.disabled) {
      return res.status(400).json({ error: { message: 'User has been deactivated.' } });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
  });

  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getUTCHours() + 1);

  const resetCode = generateRandomString(32);
  const codesRef = firebaseDb.collection('resetCodes');
  await codesRef.doc(resetCode).set({ email: email, expiresAt: expirationDate });

  const baseUrl = getBasePath(req)
  const resetLink = `${baseUrl}/update-password?code=${resetCode}`;

  const html = `
    <div>
      <h1>Hello,</h1>
      <p>Follow this link to reset your ${Branding.name} ${Branding.appName}  password for your ${email} account.</p>
      <a href="${resetLink}">Reset Password Link</a>
      <p>If you didn’t ask to reset your password, you can ignore this email.</p>
      <p>Thanks,</p>
      <p>Your ${Branding.name} ${Branding.appName} team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: `Reset Your ${Branding.name} ${Branding.appName} Password`,
    text: `Here's your password reset link: ${resetLink}`,
    html: html, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: { message: 'Failed to send email.' } });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'success' });
    }
  });

};

export default sendPasswordResetEmailHandler
