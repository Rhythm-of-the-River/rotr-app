import { useEffect, useMemo, useState } from 'react';
import scheduleJson from '@/data/schedule.json';
import type { Band, ScheduleData, Timed } from '@/types';
import { applyTiming } from '@/utils/schedule';
import BandCard from '@/components/BandCard';
import Modal from '@/components/Modal';
import SocialLinks from '@/components/SocialLinks';
import { useTime } from '@/context/TimeProvider';

const data = scheduleJson as ScheduleData;

export default function SchedulePage() {
  const { now } = useTime();
  const friday = useMemo(() => applyTiming(data.friday), []);
  const saturday = useMemo(() => applyTiming(data.saturday), []);
  const [selected, setSelected] = useState<Timed<Band> | null>(null);

  const onStage = useMemo(
    () =>
      [...friday, ...saturday].filter((b) => now >= b.start && now < b.end),
    [friday, saturday, now]
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Live Schedule
        </h1>
        <p className="text-sm text-river-300">
          Tap any artist for bio and links. Cards highlight when an act is on stage.
        </p>
      </header>

      {onStage.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sun-300">On Stage Now</h2>
          {onStage.map((band) => (
            <BandCard key={`${band.name}-now`} band={band} onClick={() => setSelected(band)} />
          ))}
        </section>
      )}

      <ScheduleDay title="Friday" bands={friday} onSelect={setSelected} />
      <ScheduleDay title="Saturday" bands={saturday} onSelect={setSelected} />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
      >
        {selected && <BandDetails band={selected} />}
      </Modal>
    </div>
  );
}

function ScheduleDay({
  title,
  bands,
  onSelect
}: {
  title: string;
  bands: Timed<Band>[];
  onSelect: (b: Timed<Band>) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-river-100">{title}</h2>
      <div className="space-y-2">
        {bands.map((band) => (
          <BandCard
            key={`${band.day}-${band.name}-${band.time}`}
            band={band}
            onClick={() => onSelect(band)}
          />
        ))}
      </div>
    </section>
  );
}

function BandDetails({ band }: { band: Timed<Band> }) {
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => {
    setImgFailed(false);
  }, [band.img]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-river-200">
        <span className="badge bg-sun-500/20 text-sun-200">{band.stage} Stage</span>
        <span>{band.time}</span>
        <span className="text-river-400">•</span>
        <span>{band.day === 'F' ? 'Friday' : 'Saturday'}</span>
      </div>
      {band.img && !imgFailed && (
        <img
          src={band.img}
          alt={band.name}
          loading="lazy"
          className="aspect-video w-full rounded-lg object-cover"
          onError={() => setImgFailed(true)}
        />
      )}
      {band.bio && <p className="text-river-100 leading-relaxed">{band.bio}</p>}
      <SocialLinks band={band} />
    </div>
  );
}
