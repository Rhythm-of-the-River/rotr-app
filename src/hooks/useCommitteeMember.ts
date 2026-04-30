import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

/**
 * Returns committee membership info for the given UID. `isMember` is true
 * when a doc exists at `committee_members/{uid}`. `name` is the optional
 * display name stored on that doc.
 */
export function useCommitteeMember(uid: string | null | undefined): {
  isMember: boolean;
  name: string | null;
  loading: boolean;
} {
  const [isMember, setIsMember] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!uid);

  useEffect(() => {
    if (!uid) {
      setIsMember(false);
      setName(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, 'committee_members', uid),
      (snap) => {
        setIsMember(snap.exists());
        const data = snap.data() as { name?: string } | undefined;
        setName(data?.name?.trim() || null);
        setLoading(false);
      },
      () => {
        setIsMember(false);
        setName(null);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  return { isMember, name, loading };
}
