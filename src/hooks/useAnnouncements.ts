import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Announcement } from '@/types';

interface AnnouncementDoc {
  user?: string;
  name?: string;
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
          // Legacy posts used the epoch-seconds timestamp as the doc ID.
          // New posts (addDoc) get a random alphanumeric ID, in which case
          // we must read `time` from the doc body. Only treat the ID as a
          // timestamp when it's entirely digits.
          const idIsNumeric = /^\d+$/.test(doc.id);
          const time = idIsNumeric
            ? parseInt(doc.id, 10)
            : data.time ?? 0;
          return {
            id: doc.id,
            time,
            user: data.user ?? '',
            name: data.name,
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
