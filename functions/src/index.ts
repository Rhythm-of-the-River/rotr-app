import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';

initializeApp();

const ANNOUNCEMENTS_TOPIC = 'announcements';

interface SubscribePayload {
  token?: string;
  subscribe?: boolean;
}

/**
 * Subscribe (or unsubscribe) a browser FCM token to the announcements topic.
 * Called from the client right after Notification.requestPermission() succeeds.
 */
export const manageAnnouncementSubscription = onCall<SubscribePayload>(
  { region: 'us-central1' },
  async (request) => {
    const { token, subscribe = true } = request.data ?? {};
    if (!token || typeof token !== 'string') {
      throw new HttpsError('invalid-argument', 'A valid FCM token is required.');
    }

    const messaging = getMessaging();
    if (subscribe) {
      const result = await messaging.subscribeToTopic([token], ANNOUNCEMENTS_TOPIC);
      if (result.failureCount > 0) {
        logger.warn('Subscribe had failures', result.errors);
      }
    } else {
      await messaging.unsubscribeFromTopic([token], ANNOUNCEMENTS_TOPIC);
    }

    return { ok: true, subscribed: subscribe };
  }
);

interface AnnouncementDoc {
  subject?: string;
  message?: string;
  user?: string;
}

/**
 * Push every new announcement out to the `announcements` topic so all opted-in
 * browsers (foreground or backgrounded) get a native notification.
 */
export const onNewAnnouncement = onDocumentCreated(
  { document: 'announcements/{id}', region: 'us-central1' },
  async (event) => {
    const data = event.data?.data() as AnnouncementDoc | undefined;
    if (!data) return;

    const title = data.subject?.trim() || 'Rhythm of the River';
    const body = (data.message ?? '').trim().slice(0, 240);

    await getMessaging().send({
      topic: ANNOUNCEMENTS_TOPIC,
      data: {
        title,
        body,
        link: '/announcements'
      },
      webpush: {
        headers: { Urgency: 'high' },
        fcmOptions: { link: '/announcements' }
      }
    });

    logger.info('Pushed announcement', { id: event.params.id, title });
  }
);
