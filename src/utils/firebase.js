import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

let app = null;
let auth = null;
let googleProvider = null;

const initializeFirebase = () => {
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
  return { app, auth, googleProvider };
};

export const signInWithGoogle = async () => {
  const { auth, googleProvider } = initializeFirebase();
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: user.photoURL,
        provider: 'google'
      }
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, message: error.message };
  }
};

export const signUpWithGoogle = async () => {
  const { auth, googleProvider } = initializeFirebase();
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: user.photoURL,
        provider: 'google'
      }
    };
  } catch (error) {
    console.error('Google sign-up error:', error);
    return { success: false, message: error.message };
  }
};

export const updateFirebaseConfig = (newConfig) => {
  Object.keys(newConfig).forEach(key => {
    if (firebaseConfig[key] && firebaseConfig[key] !== "YOUR_" + key.toUpperCase() + "_HERE") {
      console.warn(`Firebase config already has value for ${key}. Skipping update.`);
    } else {
      firebaseConfig[key] = newConfig[key];
    }
  });
  if (app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
};