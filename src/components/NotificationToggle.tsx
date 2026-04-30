import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import {
  disableNotifications,
  enableNotifications,
  getNotificationUiStatus,
  NOTIFICATION_STATE_EVENT,
  type NotificationUiStatus
} from '@/utils/notifications';

export default function NotificationToggle() {
  const [status, setStatus] = useState<NotificationUiStatus>('off');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const update = () => setStatus(getNotificationUiStatus());
    update();
    window.addEventListener(NOTIFICATION_STATE_EVENT, update);
    return () => window.removeEventListener(NOTIFICATION_STATE_EVENT, update);
  }, []);

  if (status === 'unsupported') return null;

  const onClick = async () => {
    setBusy(true);
    try {
      if (status === 'on') {
        await disableNotifications();
        setStatus('off');
      } else {
        const next = await enableNotifications();
        setStatus(next);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || status === 'denied'}
      className="btn-secondary text-sm"
      title={
        status === 'denied'
          ? 'Notifications blocked in browser settings'
          : 'Toggle festival notifications'
      }
    >
      {status === 'on' ? <Bell size={16} /> : <BellOff size={16} />}
      {status === 'on' ? 'Notifications on' : 'Enable notifications'}
    </button>
  );
}
