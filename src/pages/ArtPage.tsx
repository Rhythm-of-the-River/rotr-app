import artJson from '@/data/art.json';
import type { ArtVendor } from '@/types';
import StaleInfoBanner from '@/components/StaleInfoBanner';

const vendors = (artJson as { vendors: ArtVendor[] }).vendors;

export default function ArtPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Art Vendors
        </h1>
      </header>
      <StaleInfoBanner />
      <div className="grid gap-4 opacity-50 sm:grid-cols-2">
        {vendors.map((vendor) => (
          <article key={vendor.vendor} className="card p-4">
            <h2 className="mb-2 text-2xl text-sun-200">{vendor.vendor}</h2>
            <p className="text-sm italic text-river-200">{vendor.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
