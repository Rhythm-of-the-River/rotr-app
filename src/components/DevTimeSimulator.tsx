import { useState } from 'react';
import { Clock, X, FastForward } from 'lucide-react';
import clsx from 'clsx';
import { useTime } from '@/context/TimeProvider';
import { FESTIVAL } from '@/config';
import { parseTime } from '@/utils/time';

interface Preset {
  label: string;
  date: string;
  time: string;
}

const PRESETS: Preset[] = [
  { label: 'Pre-festival (Thu noon)', date: '2026-07-09', time: '12:00pm' },
  { label: 'Friday gates (4:30pm)', date: FESTIVAL.fridayDate, time: '4:30pm' },
  { label: 'Friday opening set', date: FESTIVAL.fridayDate, time: '5:15pm' },
  { label: 'Friday headliner', date: FESTIVAL.fridayDate, time: '10:00pm' },
  { label: 'Sat morning', date: FESTIVAL.saturdayDate, time: '11:30am' },
  { label: 'Sat afternoon', date: FESTIVAL.saturdayDate, time: '3:00pm' },
  { label: 'Sat headliner', date: FESTIVAL.saturdayDate, time: '10:00pm' },
  { label: 'After festival', date: '2026-07-12', time: '11:00am' }
];

/**
 * Floating dev-only widget for simulating the current time.
 * Renders nothing in production builds.
 */
export default function DevTimeSimulator() {
  const { now, isSimulated, setSimulatedNow, devMode } = useTime();
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState<string>(FESTIVAL.fridayDate);
  const [customTime, setCustomTime] = useState<string>('5:00pm');

  if (!devMode) return null;

  const apply = (date: string, time: string) => {
    try {
      const epoch = parseTime(date, time);
      setSimulatedNow(epoch);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-body">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx(
            'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold shadow-lg shadow-black/40',
            isSimulated
              ? 'bg-sun-500 text-river-950 animate-pulse-slow'
              : 'bg-river-700 text-river-50 hover:bg-river-600'
          )}
          title="Dev: simulate time"
        >
          <Clock size={16} />
          {isSimulated ? 'SIM' : 'DEV'}
        </button>
      ) : (
        <div className="w-72 rounded-xl border border-river-600 bg-river-900/95 p-3 text-sm shadow-2xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sun-300">
              <FastForward size={14} /> Time Simulator
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="text-river-300 hover:text-river-50"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-2 rounded bg-river-950/60 p-2 text-xs text-river-200">
            Now:{' '}
            {new Date(now * 1000).toLocaleString('en-US', {
              timeZone: FESTIVAL.timeZone,
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
            {isSimulated && (
              <span className="ml-2 rounded bg-sun-500 px-1.5 py-0.5 text-[10px] font-bold text-river-950">
                SIMULATED
              </span>
            )}
          </div>

          <div className="mb-2 grid grid-cols-2 gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => apply(p.date, p.time)}
                className="rounded bg-river-800 px-2 py-1 text-left text-xs hover:bg-river-700"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mb-2 flex gap-1">
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="input flex-1 px-2 py-1 text-xs"
            />
            <input
              type="text"
              placeholder="5:00pm"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="input w-20 px-2 py-1 text-xs"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => apply(customDate, customTime)}
              className="btn-primary flex-1 px-2 py-1 text-xs"
            >
              Simulate
            </button>
            <button
              type="button"
              onClick={() => setSimulatedNow(null)}
              className="btn-secondary flex-1 px-2 py-1 text-xs"
              disabled={!isSimulated}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
