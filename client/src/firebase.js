import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN || "taskmanager-557d7-57874.firebaseapp.com",
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID || "taskmanager-557d7-57874",
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET || "taskmanager-557d7-57874.appspot.com",
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID || "1:707471138863:web:tasky"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };
