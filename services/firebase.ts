// Firebase initialization and configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBorA928vZfRoEi0eUnqO6syX53ITGdmSQ",
    authDomain: "trustplus-3d4d8.firebaseapp.com",
    projectId: "trustplus-3d4d8",
    storageBucket: "trustplus-3d4d8.firebasestorage.app",
    messagingSenderId: "387401397132",
    appId: "1:387401397132:web:cbad3454abb4254cfd1ca9",
    measurementId: "G-C3ESH2LTST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
