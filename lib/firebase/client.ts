import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCvC3wnHMNfQyGePH-BVDjhK5-M9CaTqn4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'hopeful-dryad-l9brs.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hopeful-dryad-l9brs',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'hopeful-dryad-l9brs.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '654845419262',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:654845419262:web:5f3c518ff67de2c4024faf',
};

// Initialize Firebase safely for SSR & client environments
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'ai-studio-joyantogoldwebsi-e2b9b878-71fe-412d-8565-8bc02b33ea8c';
const db: Firestore = getFirestore(app, databaseId);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage, databaseId };
