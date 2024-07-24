// app/lip/firebase/clientApp.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApWx2LK3KKhL6asYRKBPj_M5s2UrlwPB0",
  authDomain: "flash-card-db.firebaseapp.com",
  projectId: "flash-card-db",
  storageBucket: "flash-card-db.appspot.com",
  messagingSenderId: "368264992287",
  appId: "1:368264992287:web:b5576252ad2dd278ab272a",
  measurementId: "G-C1SCYV3KJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };