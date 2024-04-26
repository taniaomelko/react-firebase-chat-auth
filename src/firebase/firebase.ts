import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbiQtgkBmQhm7jNGCY-PpNAy19LIYkEhA",
  authDomain: "react-firebase-chat-auth.firebaseapp.com",
  projectId: "react-firebase-chat-auth",
  storageBucket: "react-firebase-chat-auth.appspot.com",
  messagingSenderId: "562206344384",
  appId: "1:562206344384:web:bada8e72998fbe11b11925",
  measurementId: "G-24X2HGH6KF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, auth, storage, analytics, db };
