import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "studio-7532894983-5fe8e",
  "appId": "1:467844479955:web:76c0be94bf310347004d26",
  "storageBucket": "studio-7532894983-5fe8e.firebasestorage.app",
  "apiKey": "",
  "authDomain": "studio-7532894983-5fe8e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "467844479955"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
