import { getToken, onMessage } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FCM_VAPID_KEY, firebaseApp, getMessagingIfSupported } from '@/firebase';

const TOKEN_STORAGE_KEY = 'rotr.fcmToken';
const REGION = 'us-central1';

export type NotificationStatus = 'unsupported' | 'denied' | 'granted' | 'default';

interface SubscribeArgs {
  token: string;
  subscribe: boolean;
}

interface SubscribeResult {
  ok: boolean;
  subscribed: boolean;
}

function callSubscription(args: SubscribeArgs) {
  const fns = getFunctions(firebaseApp, REGION);
  return httpsCallable<SubscribeArgs, SubscribeResult>(
    fns,
    'manageAnnouncementSubscription'
  )(args);
}

export function getNotificationStatus(): NotificationStatus {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission as NotificationStatus;
}

/**
 * Request notification permission, register the FCM service worker, get a
 * device token, and subscribe it to the announcements topic.
 */
export async function enableNotifications(): Promise<NotificationStatus> {
  if (typeof Notification === 'undefined') return 'unsupported';
  const messaging = await getMessagingIfSupported();
  if (!messaging) return 'unsupported';

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission as NotificationStatus;

  const swRegistration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js'
  );
  const token = await getToken(messaging, {
    vapidKey: FCM_VAPID_KEY,
    serviceWorkerRegistration: swRegistration
  });

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    await callSubscription({ token, subscribe: true });
  }

  // Foreground message handler -> show a native notification.
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'Rhythm of the River';
    const body = payload.notification?.body ?? '';
    new Notification(title, { body, icon: '/favicon.ico' });
  });

  return 'granted';
}

export async function disableNotifications(): Promise<void> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    try {
      await callSubscription({ token, subscribe: false });
    } catch {
      /* ignore - server may be offline; topic sub will go stale on its own */
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
