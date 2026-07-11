import { BusFront, Phone } from 'lucide-react';

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
          Need a ride to Rhythm? We have a free shuttle within Jackson city limits!
        </p>
      </header>

      <section className="card space-y-5 p-5">
        <div>
          <h2 className="text-2xl text-sun-200">Need a ride?</h2>
          <p className="mt-1 text-river-100">
            Call{' '}
            <a href="tel:+15078472632" className="text-sun-300 hover:text-sun-200">
              (507) 847-2632
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-2xl text-sun-200">Shuttle will run</h2>
          <dl className="mt-3 space-y-3 text-river-100">
            <div className="flex justify-between gap-4 border-b border-river-700/60 pb-3">
              <dt className="font-semibold text-river-50">Friday</dt>
              <dd>5:00 PM – 12:00 AM</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-river-50">Saturday</dt>
              <dd>1:00 PM – 12:00 AM</dd>
            </div>
          </dl>
        </div>

        <p className="flex items-start gap-2 border-t border-river-700/60 pt-4 text-river-100">
          <Phone size={18} className="mt-0.5 shrink-0 text-sun-300" />
          FREE shuttle is provided by Community Transit of UCAP.
        </p>
      </section>
    </div>
  );
}
