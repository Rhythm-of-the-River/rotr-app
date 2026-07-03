import foodJson from '@/data/food.json';
import type { FoodVendor, MenuItem, MenuOption } from '@/types';

const vendors = (foodJson as { vendors: FoodVendor[] }).vendors;

export default function FoodPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Food Vendors
        </h1>
      </header>
      <div className="space-y-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.vendor} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: FoodVendor }) {
  return (
    <section className="card space-y-3 p-5">
      <div className="text-center">
        <h2 className="text-3xl text-sun-200">{vendor.vendor}</h2>
        {vendor.subtitle && (
          <p className="text-sm italic text-river-300">{vendor.subtitle}</p>
        )}
      </div>
      <hr className="border-river-700" />
      {vendor.menu.length > 0 && (
        <div className="space-y-3">
          {vendor.menu.map((item, i) => (
            <MenuRow key={i} item={item} />
          ))}
        </div>
      )}
      {vendor.note && (
        <p className="text-center text-sm italic text-river-300">{vendor.note}</p>
      )}
    </section>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  if (item.section) {
    return (
      <div className="pt-2 text-center text-sm font-bold uppercase tracking-widest text-sun-300 underline decoration-river-600 decoration-2 underline-offset-4">
        {item.section}
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-river-50">{item.item}</span>
        {item.price && <span className="text-river-200">{item.price}</span>}
      </div>
      {item.desc && (
        <p className="ml-2 text-sm italic text-river-300">{item.desc}</p>
      )}
      {item.options && (
        <div className="ml-4 space-y-0.5">
          {item.options.map((opt, i) => (
            <Option key={i} option={opt} />
          ))}
        </div>
      )}
    </div>
  );
}

function Option({ option }: { option: MenuOption }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm text-river-200">
      <span>{option.option}</span>
      {option.price && <span>{option.price}</span>}
    </div>
  );
}
