import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiKBkqcf6Ox610FmyrdUEx8Vq5DYlYLHY",
  authDomain: "quickfix-service-bdb01.firebaseapp.com",
  projectId: "quickfix-service-bdb01",
  storageBucket: "quickfix-service-bdb01.firebasestorage.app",
  messagingSenderId: "356184315139",
  appId: "1:356184315139:web:01f18d2d79fe02f1a44536",
  measurementId: "G-XTQ96VSDL3"
};

// অ্যাপ বারবার ইনপুট হওয়া আটকাতে এই লজিক
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };