// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Only import what you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWPxHOlhGM10Apdufo_mgm8mvsWrallys",
  authDomain: "digital-art-gallery-2.firebaseapp.com",
  projectId: "digital-art-gallery-2",
  storageBucket: "digital-art-gallery-2.appspot.com",
  messagingSenderId: "1041189150083",
  appId: "1:1041189150083:web:2711c113690ebf581f6ab6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
