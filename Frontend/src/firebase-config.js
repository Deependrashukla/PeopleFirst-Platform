// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdR-fOhZoy8eq10bdomowpY385L-EoNxI",
  authDomain: "peoplefirst-caba5.firebaseapp.com",
  projectId: "peoplefirst-caba5",
  storageBucket: "peoplefirst-caba5.appspot.com",
  messagingSenderId: "94387405136",
  appId: "1:94387405136:web:11ebbcec2629dd2f4b2c55",
};



const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firebase Storage
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
