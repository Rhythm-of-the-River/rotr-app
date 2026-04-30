import clsx from 'clsx';
import { MapPin } from 'lucide-react';
import type { Activity, Timed } from '@/types';
import { useTime } from '@/context/TimeProvider';
import ProgressBar from './ProgressBar';

interface ActivityCardProps {
  activity: Timed<Activity>;
}

const SOON_THRESHOLD_SEC = 60 * 60;

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { now } = useTime();
  const isInProgress = now >= activity.start && now < activity.end;
  const isPointInTime = activity.start === activity.end;
  const isStartingSoon =
    isPointInTime && activity.start > now && activity.start - now < SOON_THRESHOLD_SEC;
  const isPast = now >= activity.end && !isPointInTime;

  const minutesLeft = Math.max(0, Math.floor((activity.end - now) / 60));
  const minutesUntil = Math.max(0, Math.floor((activity.start - now) / 60));
  const progressPct = isInProgress
    ? ((now - activity.start) / Math.max(1, activity.end - activity.start)) * 100
    : 0;

  return (
    <div
      className={clsx(
        'card p-4',
        isPast && 'opacity-50',
        isInProgress && 'ring-2 ring-sun-400/60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl text-river-50">{activity.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-river-300">
            <MapPin size={14} /> {activity.location}
          </div>
          <div className="mt-1 text-sm text-river-300">{activity.time}</div>
        </div>
        <div className="text-right text-sm">
          {isInProgress && (
            <span className="badge bg-sun-500 text-river-950">In Progress</span>
          )}
          {isStartingSoon && (
            <span className="badge bg-river-500 text-river-50">Starting Soon</span>
          )}
          {isInProgress && !isPointInTime && (
            <div className="mt-1 text-xs text-sun-200">{minutesLeft} min left</div>
          )}
          {isStartingSoon && (
            <div className="mt-1 text-xs text-river-200">in {minutesUntil} min</div>
          )}
        </div>
      </div>
      {isInProgress && !isPointInTime && (
        <ProgressBar value={progressPct} className="mt-3" />
      )}
    </div>
  );
}
