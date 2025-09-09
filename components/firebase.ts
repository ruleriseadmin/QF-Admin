import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyChRLFYFw-0GrkIK3tWQZ1rIYWZViavN-s",
  authDomain: "communicationservices-94966.firebaseapp.com",
  projectId: "communicationservices-94966",
  storageBucket: "communicationservices-94966.firebasestorage.app",
  messagingSenderId: "731822565938",
  appId: "1:731822565938:web:e91c44adc7ed4290c86a2b",
  measurementId: "G-MJZCPFCY0Y"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

const fetchToken = async () => {
  if (typeof window === "undefined" || !messaging) {
    // Return null if not on the client or if messaging is undefined
    return null;
  }

  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      // Get the client token
      const currentToken = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      return currentToken;
    } else {
      console.log('Permission denied');
      return null;
    }
  } catch (error) {
    console.error('Permission error:', error);
    return null;
  }
};

export { fetchToken, messaging };