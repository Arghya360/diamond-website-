// Upload frontend assets to Firebase Storage & sync Firestore documents
// Run with: node scripts/upload-assets-to-storage.mjs

import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, collection, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCdJCORNxXI14ZWF043rEwYeAB2xMm51Qk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "caritas-luxury-diamonds.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "caritas-luxury-diamonds",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "caritas-luxury-diamonds.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "105561760579",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:105561760579:web:03d30d060fbc373bf145f6"
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const PREFIX = process.env.NEXT_PUBLIC_COLLECTION_PREFIX || 'caritas_';

async function uploadFile(localPath, storagePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const storageRef = ref(storage, storagePath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    
    await uploadBytes(storageRef, fileBuffer, { contentType });
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.warn(`Could not upload ${localPath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('--- Starting Cloud Storage Asset Synchronization ---');
  
  // Scan diamond images
  const diamondsDir = path.resolve('public/images/diamonds');
  const shopDir = path.resolve('public/images/shop');
  
  const uploadedUrls = {};

  if (fs.existsSync(diamondsDir)) {
    const files = fs.readdirSync(diamondsDir);
    for (const f of files) {
      const fullPath = path.join(diamondsDir, f);
      if (fs.statSync(fullPath).isFile()) {
        const dest = `${PREFIX}diamonds/${f}`;
        console.log(`Uploading ${f} -> ${dest}...`);
        const url = await uploadFile(fullPath, dest);
        if (url) {
          uploadedUrls[`/images/diamonds/${f}`] = url;
          console.log(`  ✓ ${url}`);
        }
      }
    }
  }

  if (fs.existsSync(shopDir)) {
    const files = fs.readdirSync(shopDir);
    for (const f of files) {
      const fullPath = path.join(shopDir, f);
      if (fs.statSync(fullPath).isFile()) {
        const dest = `${PREFIX}shop/${f}`;
        console.log(`Uploading ${f} -> ${dest}...`);
        const url = await uploadFile(fullPath, dest);
        if (url) {
          uploadedUrls[`/images/shop/${f}`] = url;
          console.log(`  ✓ ${url}`);
        }
      }
    }
  }

  console.log(`\nSuccessfully uploaded ${Object.keys(uploadedUrls).length} assets to Firebase Storage!`);
  console.log('--- Asset Sync Complete ---');
}

main().catch(err => {
  console.error('Asset upload runner encountered:', err);
  process.exit(1);
});
