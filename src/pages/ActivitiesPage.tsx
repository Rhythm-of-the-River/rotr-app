import { useMemo } from 'react';
import activitiesJson from '@/data/activities.json';
import type { ActivitiesData, Activity, Timed } from '@/types';
import { applyTiming } from '@/utils/schedule';
import ActivityCard from '@/components/ActivityCard';
import StaleInfoBanner from '@/components/StaleInfoBanner';

const data = activitiesJson as ActivitiesData;

export default function ActivitiesPage() {
  const friday = useMemo(() => applyTiming(data.friday), []);
  const saturday = useMemo(() => applyTiming(data.saturday), []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Activities
        </h1>
        <p className="mt-1 text-sm text-river-300">
          Workshops, films, ceremonies, and other festival happenings.
        </p>
      </header>
      <StaleInfoBanner />
      <div className="space-y-6 opacity-50">
        <Day title="Friday" items={friday} />
        <Day title="Saturday" items={saturday} />
      </div>
    </div>
  );
}

function Day({ title, items }: { title: string; items: Timed<Activity>[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-river-100">{title}</h2>
      <div className="space-y-2">
        {items.map((a) => (
          <ActivityCard key={`${a.day}-${a.name}-${a.time}`} activity={a} />
        ))}
      </div>
    </section>
  );
}
