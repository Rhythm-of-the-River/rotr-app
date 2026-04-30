import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Modal from './Modal';
import {
  enableNotifications,
  shouldShowFirstVisitPrompt
} from '@/utils/notifications';

const DISMISSED_KEY = 'rotr.notificationsPromptDismissed';

export default function NotificationsPrompt() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (!shouldShowFirstVisitPrompt()) return;
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => setOpen(false);

  const onNotNow = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    close();
  };

  const onEnable = async () => {
    setBusy(true);
    try {
      await enableNotifications();
    } finally {
      setBusy(false);
      close();
    }
  };

  return (
    <Modal open={open} onClose={onNotNow} title="Stay in the loop">
      <div className="space-y-4 text-river-100">
        <div className="flex items-start gap-3">
          <Bell className="mt-1 shrink-0 text-sun-300" size={22} />
          <p>
            We send festival announcements — schedule changes, weather
            updates, surprise happenings — as push notifications. Want them
            on this device?
          </p>
        </div>
        <p className="text-sm text-river-300">
          Your browser will ask you to confirm. You can turn it off any time
          from the Announcements page.
        </p>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onNotNow}
            className="btn-secondary text-sm"
            disabled={busy}
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onEnable}
            className="btn-primary text-sm"
            disabled={busy}
          >
            {busy ? 'Enabling…' : 'Enable notifications'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
