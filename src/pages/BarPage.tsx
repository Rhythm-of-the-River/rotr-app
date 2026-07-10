import barJson from '@/data/bar.json';
import type { BarData, BarSection, BarMenuItem } from '@/types';

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
        </div>
        {data.sections && data.sections.length > 0 && (
          <>
            <hr className="border-river-700" />
            <div className="space-y-5">
              {data.sections.map((section, i) => (
                <SectionBlock key={i} section={section} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function SectionBlock({ section }: { section: BarSection }) {
  return (
    <div className="space-y-2">
      <div className="text-center">
        <h3 className="font-semibold text-sun-300">{section.name}</h3>
        {section.subtitle && (
          <p className="text-xs italic text-river-400">{section.subtitle}</p>
        )}
      </div>
      <div className="space-y-1">
        {section.items.map((item, i) => (
          <MenuRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

function MenuRow({ item }: { item: BarMenuItem }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-medium text-river-50">
        {item.item}
        {item.desc && (
          <span className="ml-1 text-sm font-normal italic text-river-300">
            {item.desc}
          </span>
        )}
      </span>
      {item.price && <span className="text-river-200">{item.price}</span>}
    </div>
  );
}
