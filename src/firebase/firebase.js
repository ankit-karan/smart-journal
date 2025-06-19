import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ,
  authDomain: "smart-journal-app-6c9d3.firebaseapp.com",
  projectId: "smart-journal-app-6c9d3",
  storageBucket: "smart-journal-app-6c9d3.firebasestorage.app",
  messagingSenderId: "580096686245",
  appId: "1:580096686245:web:6242ca1b24532ad079354c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider(); // ✅ Add this line

export { auth, db, googleProvider }; // ✅ Export it
