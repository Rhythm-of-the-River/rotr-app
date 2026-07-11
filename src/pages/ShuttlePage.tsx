import { BusFront, ExternalLink, MapPin } from 'lucide-react';

const PARKING_URL = 'https://www.rhythmoftheriver.org/parking';

export default function ShuttlePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3 text-sun-300">
          <BusFront size={28} />
          <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
            Shuttle Information
          </h1>
        </div>
        <p className="text-river-200">
          Leave your car at the off-site lot and ride the free shuttle to the festival.
        </p>
      </header>

      <section className="card space-y-5 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 shrink-0 text-sun-300" size={20} />
          <div>
            <h2 className="text-2xl text-sun-200">Where to catch it</h2>
            <p className="mt-1 text-river-100">
              Park at the Detroit Lakes High School parking lot. The shuttle will
              take you from the lot to the festival entrance.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-river-800/60 p-4">
            <h3 className="font-semibold text-river-50">Frequency</h3>
            <p className="mt-1 text-river-200">Every 15–20 minutes during festival hours.</p>
          </div>
          <div className="rounded-lg bg-river-800/60 p-4">
            <h3 className="font-semibold text-river-50">Cost</h3>
            <p className="mt-1 text-river-200">The shuttle is free.</p>
          </div>
        </div>
      </section>

      <a
        href={PARKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary"
      >
        <ExternalLink size={16} />
        View parking details
      </a>
    </div>
  );
}
