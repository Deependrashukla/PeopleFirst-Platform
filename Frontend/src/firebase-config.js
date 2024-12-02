// // src/firebase-config.js
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyBdR-fOhZoy8eq10bdomowpY385L-EoNxI",
//   authDomain: "peoplefirst-caba5.firebaseapp.com",
//   projectId: "peoplefirst-caba5",
//   storageBucket: "peoplefirst-caba5.appspot.com",
//   messagingSenderId: "94387405136",
//   appId: "1:94387405136:web:11ebbcec2629dd2f4b2c55",
// };



// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and Firebase Storage
// const auth = getAuth(app);
// const storage = getStorage(app);

// export { app, auth, storage };


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 


const firebaseConfig = {
  apiKey: "AIzaSyCLMTvmSQNcqm8gEL18Azl1U5bK6xCpjeg",
  authDomain: "padhai-abab6.firebaseapp.com",
  projectId: "padhai-abab6",
  storageBucket: "padhai-abab6.appspot.com",
  messagingSenderId: "187092052576",
  appId: "1:187092052576:web:9a13b59d3e6352e7467105",
  measurementId: "G-YJZBQP2CJE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app)
export { app, analytics, storage, db, provider, auth };
