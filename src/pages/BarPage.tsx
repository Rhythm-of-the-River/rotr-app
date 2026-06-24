import barJson from '@/data/bar.json';
const data = barJson as { vendor: string };

export default function BarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Bar
        </h1>
      </header>
      <section className="card space-y-3 p-5">
        <h2 className="text-center text-3xl text-sun-200">{data.vendor}</h2>
        <p className="text-center text-sm italic text-river-300">
          To cut down on waste, we'd appreciate if you bring your own cup or pick one
          up at the merch tent. Cups are $15, or grab a cup, koozie, and drink combo
          for $25.
        </p>
        <hr className="border-river-700" />
        <div className="space-y-3 text-river-100">
          <p>
            Take 16 Brewing Company is a community-built craft brewery based in
            Luverne, Minnesota.
          </p>
          <p>
            They are known for approachable taproom favorites like Country Mile
            Kölsch and a rotating mix of lagers, IPAs, and seasonal releases.
          </p>
          <p className="text-sm italic text-river-300">
            Full festival bar selections will be posted soon.
          </p>
        </div>
      </section>
    </div>
  );
}
