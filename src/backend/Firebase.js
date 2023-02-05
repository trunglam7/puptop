/* Firebase Setup */
/********************************************************************/
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT6GjgsyDthDZR0hpF1MNoXz9FapsXRro",
  authDomain: "dog-rating.firebaseapp.com",
  projectId: "dog-rating",
  storageBucket: "dog-rating.appspot.com",
  messagingSenderId: "637059492278",
  appId: "1:637059492278:web:03727510dd86ffec883917",
  measurementId: "G-JT6JCLNCZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
/********************************************************************/