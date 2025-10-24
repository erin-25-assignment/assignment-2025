import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  GoogleAuthProvider,
  // Also exporting User type for convenience
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// =================================================================================
// IMPORTANT: FIREBASE CONFIGURATION
// =================================================================================
// Replace the placeholder values below with your actual Firebase project's configuration.
// You can find this configuration in your Firebase project settings.
// Refer to the README.md for more detailed instructions on setting up Firebase.
//
// NOTE: Using a .env file will NOT work in this environment.
// You MUST enter your configuration values directly here.
// =================================================================================
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export the User type to use in components
export type { User };

export { 
    app,
    auth, 
    db,
    googleProvider
};