// scripts/create-admin-user.mjs
// Run this AFTER enabling Firebase Authentication (Email/Password) in the Firebase Console:
// https://console.firebase.google.com/project/caritas-luxury-diamonds/authentication/providers

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdJCORNxXI14ZWF043rEwYeAB2xMm51Qk",
  authDomain: "caritas-luxury-diamonds.firebaseapp.com",
  projectId: "caritas-luxury-diamonds",
  storageBucket: "caritas-luxury-diamonds.firebasestorage.app",
  messagingSenderId: "105561760579",
  appId: "1:105561760579:web:03d30d060fbc373bf145f6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
  const cred = await createUserWithEmailAndPassword(
    auth,
    'caritas360@caritasluxury.com',
    'Caritas1234!@#'
  );

  await setDoc(doc(db, 'caritas_adminUsers', cred.user.uid), {
    uid: cred.user.uid,
    username: 'Caritas360',
    email: 'caritas360@caritasluxury.com',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  });

  console.log('✅ Admin user created successfully!');
  console.log('   UID:', cred.user.uid);
  console.log('   Email: caritas360@caritasluxury.com');
  console.log('   Username: Caritas360');
  process.exit(0);
} catch (e) {
  if (e.code === 'auth/email-already-in-use') {
    console.log('✅ Admin user already exists — no action needed.');
    process.exit(0);
  }
  console.error('❌ Error:', e.message);
  process.exit(1);
}
