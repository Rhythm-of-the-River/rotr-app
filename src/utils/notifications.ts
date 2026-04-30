import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FCM_VAPID_KEY, firebaseApp, getMessagingIfSupported } from '@/firebase';

const ENABLED_KEY = 'rotr.notificationsEnabled';
const TOKEN_KEY = 'rotr.fcmToken';
const REGION = 'us-central1';

export const NOTIFICATION_STATE_EVENT = 'rotr:notification-state-changed';

export type NotificationUiStatus = 'unsupported' | 'denied' | 'on' | 'off';

function emit() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NOTIFICATION_STATE_EVENT));
  }
}

function isSupported(): boolean {
  return typeof Notification !== 'undefined' && 'serviceWorker' in navigator;
}

export function getNotificationUiStatus(): NotificationUiStatus {
  if (!isSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return localStorage.getItem(ENABLED_KEY) === '1' ? 'on' : 'off';
}

/**
 * True if the browser has never been asked for permission. Used to decide
 * whether to show the first-visit prompt.
 */
export function shouldShowFirstVisitPrompt(): boolean {
  if (!isSupported()) return false;
  if (Notification.permission !== 'default') return false;
  return localStorage.getItem(ENABLED_KEY) === null;
}

function callSubscription(token: string, subscribe: boolean) {
  const fns = getFunctions(firebaseApp, REGION);
  return httpsCallable<{ token: string; subscribe: boolean }, { ok: boolean }>(
    fns,
    'manageAnnouncementSubscription'
  )({ token, subscribe });
}

export async function enableNotifications(): Promise<NotificationUiStatus> {
  if (!isSupported()) return 'unsupported';

  const permission = await Notification.requestPermission();
  if (permission === 'denied') {
    localStorage.setItem(ENABLED_KEY, '0');
    emit();
    return 'denied';
  }
  if (permission !== 'granted') {
    // 'default' = user dismissed without choosing. Treat as off.
    emit();
    return 'off';
  }

  // Mark enabled immediately so the UI is responsive even if the backend
  // round-trip fails or is slow.
  localStorage.setItem(ENABLED_KEY, '1');
  emit();

  try {
    const messaging = await getMessagingIfSupported();
    if (!messaging) return 'on';

    const swRegistration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );
    const token = await getToken(messaging, {
      vapidKey: FCM_VAPID_KEY,
      serviceWorkerRegistration: swRegistration
    });
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      try {
        await callSubscription(token, true);
      } catch {
        // Backend may be offline / not deployed yet. Subscription will be
        // retried next time the user toggles or visits.
      }
    }

    onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? 'Rhythm of the River';
      const body = payload.notification?.body ?? '';
      new Notification(title, { body, icon: '/favicon.svg' });
    });
  } catch {
    // Token / SW failures don't change the user-facing on/off state.
  }

  return 'on';
}

export async function disableNotifications(): Promise<void> {
  localStorage.setItem(ENABLED_KEY, '0');
  emit();

  const token = localStorage.getItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);

  if (token) {
    try {
      await callSubscription(token, false);
    } catch {
      /* best effort */
    }
  }
  try {
    const messaging = await getMessagingIfSupported();
    if (messaging) await deleteToken(messaging);
  } catch {
    /* best effort */
  }
}
