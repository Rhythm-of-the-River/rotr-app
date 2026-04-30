import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import {
  disableNotifications,
  enableNotifications,
  getNotificationStatus,
  type NotificationStatus
} from '@/utils/notifications';

export default function NotificationToggle() {
  const [status, setStatus] = useState<NotificationStatus>('default');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(getNotificationStatus());
  }, []);

  if (status === 'unsupported') return null;

  const onClick = async () => {
    setBusy(true);
    try {
      if (status === 'granted') {
        await disableNotifications();
        setStatus('default');
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
      {status === 'granted' ? <Bell size={16} /> : <BellOff size={16} />}
      {status === 'granted' ? 'Notifications on' : 'Enable notifications'}
    </button>
  );
}
