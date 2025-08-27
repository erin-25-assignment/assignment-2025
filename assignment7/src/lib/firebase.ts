import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "ts-react-shop",
  "appId": "1:836216393858:web:86be788d5d06fe53ea649b",
  "storageBucket": "ts-react-shop.firebasestorage.app",
  "apiKey": "AIzaSyBFgL7S3IRuTHKzcGqnmAlEIzlPyin46H4",
  "authDomain": "ts-react-shop.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "836216393858"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
