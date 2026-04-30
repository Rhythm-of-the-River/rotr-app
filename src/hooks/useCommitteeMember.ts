import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

/**
 * Returns true if the given user UID has a doc in `committee_members/{uid}`.
 * Use this to gate access to /floyd posting.
 */
export function useCommitteeMember(uid: string | null | undefined): {
  isMember: boolean;
  loading: boolean;
} {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState<boolean>(!!uid);

  useEffect(() => {
    if (!uid) {
      setIsMember(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, 'committee_members', uid),
      (snap) => {
        setIsMember(snap.exists());
        setLoading(false);
      },
      () => {
        setIsMember(false);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  return { isMember, loading };
}
