import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY || "REMOVED_FIREBASE_KEY",
  authDomain: "taskmanager-557d7.firebaseapp.com",
  projectId: "taskmanager-557d7",
  storageBucket: "taskmanager-557d7.appspot.com",
  appId: "1:707471138863:web:tasky"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };
