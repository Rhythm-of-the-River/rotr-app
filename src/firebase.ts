import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getMessaging, isSupported as messagingSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBo-2eO3_F78gMai3gyrt2wpnQc2esn6oc',
  authDomain: 'rotr-app.firebaseapp.com',
  projectId: 'rotr-app',
  storageBucket: 'rotr-app.firebasestorage.app',
  messagingSenderId: '763868835094',
  appId: '1:763868835094:web:e04fa89fc3ba94393b3437',
  measurementId: 'G-V97V3QX6KQ'
};

/**
 * Public VAPID key for FCM web push (Firebase Console → Project Settings →
 * Cloud Messaging → Web configuration). Safe to embed: this is the public
 * half of the keypair and ships to every browser anyway.
 */
export const FCM_VAPID_KEY =
  'BKGCUplk418O1-27d65hdtllqD3Udqinsm5SS3xl3nA55XhPhcXrC9u35aqh3lT6qhObnYAnpa9_agAhBGpom0w';

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);

let messagingInstance: Messaging | null = null;

export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance;
  if (!(await messagingSupported())) return null;
  messagingInstance = getMessaging(firebaseApp);
  return messagingInstance;
}
