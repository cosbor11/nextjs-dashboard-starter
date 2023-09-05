import { initializeApp } from 'firebase/app';

const isLocalhost = () => {
  if (process.env.VERCEL_ENV === 'development') {
    return false;
  }
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost';
  }
  return !process.env.VERCEL_ENV;
};

let firebaseAuthDomain:string|undefined = `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`

if (!isLocalhost()) {
  console.log("you are live!");
  firebaseAuthDomain = process.env.NEXT_PUBLIC_HOST_DOMAIN;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: firebaseAuthDomain,
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;

