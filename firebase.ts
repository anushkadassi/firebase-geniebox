// firebase.tsx
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set } from "firebase/database"; 

// Your Firebase config here
const firebaseConfig = {
    apiKey: "AIzaSyBKucMrDsL0psRcIdDFF7qUJCG8YL2aO58",
    authDomain: "promo-tracker-5b330.firebaseapp.com",
    databaseURL: "https://promo-tracker-5b330-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "promo-tracker-5b330",
    storageBucket: "promo-tracker-5b330.firebasestorage.app",
    messagingSenderId: "267519194679",
    appId: "1:267519194679:web:9c31790cda833cc17531b2",
    measurementId: "G-YNCDN9GCLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app); 

// Google Sign-In
export const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Sign Out
export const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };
export function saveUserData(userId, data) {
    set(ref(database, 'users/' + userId), data)
      .then(() => {
        console.log("Data saved successfully.");
      })
      .catch((error) => {
        console.error("Error saving data: ", error);
      });
  }
