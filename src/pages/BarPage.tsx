import barJson from '@/data/bar.json';
import type { BarData, BarItem } from '@/types';

const data = barJson as BarData;

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
        <div className="space-y-4">
          {data.items.map((item) => (
            <Item key={item.item} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Item({ item }: { item: BarItem }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold text-river-50">{item.item}</span>
        <span className="text-river-200">{item.price}</span>
      </div>
      {item.selection && (
        <ul className="mt-1 space-y-2 pl-4">
          {item.selection.map((sel) => (
            <li key={sel.name} className="text-sm">
              <div className="font-medium text-river-100">{sel.name}</div>
              {sel.description && (
                <div className="text-river-300 italic">{sel.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
