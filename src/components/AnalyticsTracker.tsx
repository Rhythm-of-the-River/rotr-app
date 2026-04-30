import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { getAnalyticsIfSupported } from '@/firebase';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    getAnalyticsIfSupported().then((analytics) => {
      if (cancelled || !analytics) return;
      logEvent(analytics, 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title
      });
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  return null;
}
