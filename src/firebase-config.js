import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBir5h08xsjeACE4DzsFOTiTPBEouFPtqg",
  authDomain: "netracker-d1013.firebaseapp.com",
  projectId: "netracker-d1013",
  storageBucket: "netracker-d1013.firebasestorage.app",
  messagingSenderId: "892068237911",
  appId: "1:892068237911:web:45258394d350239af30912"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication & Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };