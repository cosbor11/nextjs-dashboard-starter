import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getAuth, signOut, signInWithCustomToken, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithEmailAndPassword, getRedirectResult, signInWithRedirect, UserCredential } from 'firebase/auth';
import firebaseApp from '@/src/firebase/firebase-app';
import { toast } from 'react-toastify';
import { Inter } from 'next/font/google'
import LoadingOverlay from '../components/LoadingOverlay';

const inter = Inter({ subsets: ['latin'] })

interface AuthContextProps {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithNewPassword: () => Promise<void>;
  handleRedirectResult: () => Promise<UserCredential | null>;
  authCheckCompleted: boolean;
  onLoginResponse: (result: UserCredential | null) => void;
  loginWithCustomToken: (customToken: string) => Promise<UserCredential>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(firebaseApp);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('logout')) {
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);
        toast.success(`You have been signed out.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithNewPassword = async () => {
    try {
      await signOut(auth);
      setUser(null)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('pwUpdate')) {
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);
        toast.success(`Password Updated Successfully! Sign in with your new password`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithCustomToken = async (customToken: string): Promise<UserCredential> => {
    try {
      const response = await signInWithCustomToken(auth, customToken);
      onLoginResponse(response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onLoginResponse = async (result: UserCredential | null) => {
    if (result && result.user) {
      setUser(result.user)
      window.location.href = "/dashboard"
    }
  }

  const handleRedirectResult = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const result = await getRedirectResult(auth);
      return result
    } catch (error) {
      console.error(error);
      return null
    }
  };

  // save the auth to local storage
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setUser(authUser)
      const pathName = new URL(window.location.href).pathname;
      if (authUser) {
        if (pathName == "/") { //home page should either direct to /dashboard or /signin
          window.location.href = '/dashboard';
        }
        setAuthCheckCompleted(true);
      } else {
        const allowedPaths = ['/signin', '/register', '/reset-password', '/update-password', '/signin-with-google'];
        if (!allowedPaths.includes(pathName)) {
          window.location.href = '/signin';
          setAuthCheckCompleted(true);
        }
      }
      setAuthCheckCompleted(true);
    });

    setPersistence(auth, browserLocalPersistence);

  }, [auth]);


  const signInWithGoogle = async () => {
    setAuthCheckCompleted(false)
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    try {
      sessionStorage.setItem("expectRedirect", "true")
      signInWithRedirect(auth, provider);
    } catch (error) {
      sessionStorage.removeItem("expectRedirect")
      if (error instanceof Error) { // Check if error is an instance of the Error class
        toast.error(`Failed to sign in with Google: ${error.message}`);
      } else {
        toast.error(`Failed to sign in with Google: ${error}`);
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      onLoginResponse(response)
    } catch (error: any) {
      if (error.code == 'auth/wrong-password' || error.code == 'auth/user-not-found') {
        toast.error("Invalid Username or Password")
      } else {
        toast.error(`unexpected error occurred. Please try again later.`)
      }

    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmail, logout, loginWithNewPassword, handleRedirectResult, authCheckCompleted, onLoginResponse, loginWithCustomToken }}>
      {!authCheckCompleted  && (
        <LoadingOverlay />
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};