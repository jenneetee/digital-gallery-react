// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Only import what you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT06UbbyuqkCospHIF8TXCIsavhIzMKzw",
  authDomain: "digital-art-gallery-2941d.firebaseapp.com",
  projectId: "digital-art-gallery-2941d",
  storageBucket: "digital-art-gallery-2941d.appspot.com",
  messagingSenderId: "752229035034",
  appId: "1:752229035034:web:1dd97833330cf1f70cf5a3",
  measurementId: "G-RDTBRP8DDW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
