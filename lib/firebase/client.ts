import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '';
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '';
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '';
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '';

export const isFirebaseConfigured = Boolean(apiKey && projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    const config = {
      apiKey,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: storageBucket || `${projectId}.firebasestorage.app`,
      messagingSenderId,
      appId,
    };
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    auth = getAuth(app);
    db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization error, running in standalone mode:', error);
  }
}

export { app, auth, db, storage, databaseId, projectId };
