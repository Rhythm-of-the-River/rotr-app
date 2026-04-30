import clsx from 'clsx';
import type { Band, Timed } from '@/types';
import { useTime } from '@/context/TimeProvider';
import ProgressBar from './ProgressBar';

interface BandCardProps {
  band: Timed<Band>;
  onClick?: () => void;
}

export default function BandCard({ band, onClick }: BandCardProps) {
  const { now } = useTime();
  const isLive = now >= band.start && now < band.end;
  const isPast = now >= band.end;
  const minutesLeft = Math.max(0, Math.floor((band.end - now) / 60));
  const progressPct = isLive ? ((now - band.start) / (band.end - band.start)) * 100 : 0;

  const stageStyles =
    band.stage === 'Main'
      ? 'border-l-4 border-l-sun-400'
      : 'ml-3 sm:ml-6 border-l-4 border-l-river-400';

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'card card-hover w-full p-4 text-left',
        stageStyles,
        isPast && 'opacity-50',
        isLive && 'ring-2 ring-sun-400/60 shadow-sun-500/20'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={clsx(
                'badge',
                band.stage === 'Main' ? 'bg-sun-500/20 text-sun-200' : 'bg-river-700 text-river-200'
              )}
            >
              {band.stage}
            </span>
            <h3
              className={clsx(
                'truncate font-display text-xl sm:text-2xl',
                band.stage === 'Main' ? 'text-river-50' : 'text-river-100'
              )}
            >
              {band.name}
            </h3>
          </div>
          <div className="mt-1 text-sm text-river-300">{band.time}</div>
        </div>

        <div className="text-right text-sm">
          {isLive && (
            <span className="badge bg-sun-500 text-river-950">On Stage</span>
          )}
          {isLive && (
            <div className="mt-1 text-xs text-sun-200">{minutesLeft} min left</div>
          )}
        </div>
      </div>

      {isLive && <ProgressBar value={progressPct} className="mt-3" />}
    </button>
  );
}
