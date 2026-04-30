import { useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import NotificationToggle from '@/components/NotificationToggle';
import { formatClock } from '@/utils/time';
import type { Announcement } from '@/types';

const READ_KEY = 'rotr.lastReadAnnouncement';

export default function AnnouncementsPage() {
  const { announcements, loading, error } = useAnnouncements();

  useEffect(() => {
    if (announcements.length > 0) {
      const value = String(announcements[0].time);
      localStorage.setItem(READ_KEY, value);
      window.dispatchEvent(new StorageEvent('storage', { key: READ_KEY, newValue: value }));
    }
  }, [announcements]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Announcements
        </h1>
        <NotificationToggle />
      </header>

      {loading && <p className="text-river-300">Loading…</p>}
      {error && (
        <div className="card p-4 text-sm text-sun-300">
          Couldn't load announcements: {error}
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <div className="card flex items-center gap-3 p-5 text-river-200">
          <Megaphone size={20} className="text-sun-300" />
          No announcements yet — check back during the festival.
        </div>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} />
        ))}
      </div>
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const lines = announcement.message
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <article className="card animate-fade-in p-4">
      <header className="mb-2 flex items-start justify-between gap-3">
        <h2 className="text-2xl text-sun-200">{announcement.subject}</h2>
        <span className="badge bg-river-700 text-river-200">
          {formatClock(announcement.time)}
        </span>
      </header>
      <div className="space-y-1 italic text-river-100">
        {lines.map((line, i) => (
          <p key={i}>
            {i === 0 && '“'}
            {line}
            {i === lines.length - 1 && '”'}
          </p>
        ))}
      </div>
      {(announcement.name || announcement.user) && (
        <footer className="mt-2 text-right text-sm text-river-300">
          — {announcement.name || announcement.user}
        </footer>
      )}
    </article>
  );
}
