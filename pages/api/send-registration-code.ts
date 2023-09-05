import Branding from '@/components/branding/Branding';
import firebaseDb from '@/src/firebase/firebase-db';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface SendMailInfo {
  response: string;
}

const sendRegistrationCodeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = JSON.parse(req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const registrationCode = generateRandomString(10);
  const codesRef = firebaseDb.collection('registrationCodes');
  await codesRef.doc(email).set({ code: registrationCode });

  // Email data
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: `${Branding.name} ${Branding.appName} Registration Code`,
    text: `Here's your registration code: ${registrationCode}`,
    html: `<h1> Welcome to ${Branding.name} ${Branding.appName}</h1> 
    <p>Here's your registration code:</p> 
    <div style="display: flex; align-items: center;">
        <div style="border: 1px solid #ccc; padding: 4px; display: inline-block; background-color: #f5f5f5; border-radius: 4px;">
            <p style="margin: 4px;" id="copyText">${registrationCode}</p>
        </div>
    </div>`
  };

  // Send email using await
  try {
    const info = await new Promise<SendMailInfo>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    console.log('Email sent: ' + info.response);
    return res.status(200).send(`{"message": "success"}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export default sendRegistrationCodeHandler;
