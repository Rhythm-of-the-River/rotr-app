import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Megaphone } from 'lucide-react';
import clsx from 'clsx';
import { NAV_LINKS, FESTIVAL } from '@/config';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useTime } from '@/context/TimeProvider';
import { parseTime } from '@/utils/time';

const READ_KEY = 'rotr.lastReadAnnouncement';

function useUnreadCount(latestTime: number): number {
  const [lastRead, setLastRead] = useState<number>(() => {
    const stored = localStorage.getItem(READ_KEY);
    return stored ? parseInt(stored, 10) || 0 : 0;
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === READ_KEY) setLastRead(parseInt(e.newValue ?? '0', 10) || 0);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return latestTime > lastRead ? 1 : 0;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeRef = useRef<HTMLDivElement>(null);
  const { announcements } = useAnnouncements();
  const latestTime = announcements[0]?.time ?? 0;
  const unread = useUnreadCount(latestTime);
  const { now } = useTime();

  const visibleLinks = useMemo(() => {
    const festivalStartSec = parseTime(FESTIVAL.fridayDate, '12:00am');
    const hasStarted = now >= festivalStartSec;
    return NAV_LINKS.filter((link) => {
      if (link.visibility === 'before-festival') return !hasStarted;
      if (link.visibility === 'during-after') return hasStarted;
      return true;
    });
  }, [now]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (closeRef.current && !closeRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-river-700/50 bg-river-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl tracking-wider sm:text-3xl">
          <span className="text-sun-400">Rhythm</span> of the{' '}
          <span className="text-river-300">River</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {visibleLinks.map((link) => (
            <NavItem key={link.label} link={link} unread={unread} />
          ))}
        </nav>

        <div ref={closeRef} className="lg:hidden">
          <button
            type="button"
            aria-label="Toggle navigation"
            className="relative rounded-md p-2 text-river-100 hover:bg-river-800"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            {!mobileOpen && unread > 0 && (
              <Megaphone
                size={14}
                className="absolute -right-0.5 -top-0.5 rounded-full bg-sun-500 p-0.5 text-river-950"
              />
            )}
          </button>

          {mobileOpen && (
            <div className="absolute right-2 top-full mt-2 w-56 animate-fade-in rounded-lg border border-river-700 bg-river-900 p-2 shadow-2xl">
              {visibleLinks.map((link) => (
                <NavItem
                  key={link.label}
                  link={link}
                  unread={unread}
                  mobile
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface NavItemProps {
  link: (typeof NAV_LINKS)[number];
  unread: number;
  mobile?: boolean;
  onClick?: () => void;
}

function NavItem({ link, unread, mobile, onClick }: NavItemProps) {
  const isAnnouncements = link.label === 'Announcements';
  const baseClass = clsx(
    'relative font-medium transition',
    mobile ? 'block rounded-md px-3 py-2 hover:bg-river-800' : 'hover:text-sun-300'
  );

  if (link.external) {
    return (
      <a
        href={link.to}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        onClick={onClick}
      >
        {link.label}
      </a>
    );
  }

  return (
    <NavLink
      to={link.to}
      end={link.to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          baseClass,
          isActive && (mobile ? 'bg-river-800' : 'text-sun-300'),
          isAnnouncements && unread > 0 && 'text-sun-400'
        )
      }
    >
      {link.label}
      {isAnnouncements && unread > 0 && (
        <span className="ml-1 inline-block h-2 w-2 animate-pulse-slow rounded-full bg-sun-400" />
      )}
    </NavLink>
  );
}
