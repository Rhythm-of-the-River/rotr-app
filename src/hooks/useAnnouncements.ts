import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Announcement } from '@/types';

interface AnnouncementDoc {
  user?: string;
  subject?: string;
  message?: string;
}

export function useAnnouncements(): {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
} {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'announcements'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Announcement[] = snap.docs.map((doc) => {
          const data = doc.data() as AnnouncementDoc & { time?: number };
          // Doc IDs are stored as the post timestamp (epoch seconds).
          const timeFromId = parseInt(doc.id, 10);
          const time = Number.isFinite(timeFromId) ? timeFromId : data.time ?? 0;
          return {
            id: doc.id,
            time,
            user: data.user ?? '',
            subject: data.subject ?? '',
            message: data.message ?? ''
          };
        });
        // Sort by time desc as fallback (in case docs use string IDs).
        list.sort((a, b) => b.time - a.time);
        setAnnouncements(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { announcements, loading, error };
}
