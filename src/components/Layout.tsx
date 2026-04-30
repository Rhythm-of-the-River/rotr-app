import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DevTimeSimulator from './DevTimeSimulator';
import AnalyticsTracker from './AnalyticsTracker';
import NotificationsPrompt from './NotificationsPrompt';

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <AnalyticsTracker />
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <DevTimeSimulator />
      <NotificationsPrompt />
    </div>
  );
}
