import Link from "next/link";
import { CATEGORIES, DIANI_SPOTS, PRICE_TIERS, REGIONS } from "@/lib/constants";
import {
  getBudgetListings,
  getFeaturedListings,
  getListingStats,
  getLuxuryListings,
  getRegionCounts,
} from "@/lib/data";
import ListingCard from "@/components/ListingCard";

export const dynamic = "force-dynamic";

const HERO_IMG =
  "https://images.pexels.com/photos/15994021/pexels-photo-15994021.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1280";

export default async function HomePage() {
  const [featured, budget, luxury, regionCounts, stats] = await Promise.all([
    getFeaturedListings(8),
    getBudgetListings(10),
    getLuxuryListings(10),
    getRegionCounts(),
    getListingStats(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMG}
            alt="Mount Kilimanjaro rising above the Kenyan plains"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-12 sm:pb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-300">
              Kenya · Safari &amp; wilderness stays
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              Find your place in the wild.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              Beachfront villas, bush homes and hosted camps run by Kenyan locals — your home-from-home
              beside the reserves, the coast and the city.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="brand-bg rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-xl"
              >
                Explore all stays
              </Link>
              <Link
                href="/listings?region=Maasai%20Mara"
                className="rounded-full bg-white/95 px-7 py-3.5 text-sm font-bold text-ink shadow-xl"
              >
                Maasai Mara escapes
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-white">
              <div>
                <dt className="text-3xl font-extrabold">{stats.stays}+</dt>
                <dd className="text-sm text-white/80">curated stays</dd>
              </div>
              <div>
                <dt className="text-3xl font-extrabold">{stats.regions}</dt>
                <dd className="text-sm text-white/80">safari regions</dd>
              </div>
              <div>
                <dt className="text-3xl font-extrabold">{stats.parks}</dt>
                <dd className="text-sm text-white/80">parks &amp; reserves</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="no-scrollbar -mx-1 mb-2 flex gap-2 overflow-x-auto px-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/listings?type=${c.key}`}
              className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border border-slate-200 px-5 py-3 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-md"
            >
              <span className="text-2xl">{c.icon}</span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured wilderness stays</h2>
            <p className="mt-1 text-slate-500">Top-rated homes &amp; hosted stays our travellers love.</p>
          </div>
          <Link href="/listings?sort=rating" className="hidden shrink-0 font-semibold text-brand sm:block">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Stay for any budget */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-1 text-2xl font-bold sm:text-3xl">Stay for any budget</h2>
        <p className="mb-6 text-slate-500">From backpacker bandas to private luxury villas.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PRICE_TIERS.map((t) => (
            <Link
              key={t.key}
              href={`/listings?tier=${t.key}`}
              className="group rounded-2xl border border-slate-200 p-6 transition hover:border-slate-400 hover:shadow-lg"
            >
              <div className="text-3xl">{t.icon}</div>
              <h3 className="mt-3 text-lg font-bold">{t.label} stays</h3>
              <p className="mt-1 text-sm text-slate-600">{t.blurb}</p>
              <p className="mt-3 text-sm font-semibold text-brand">
                Browse {t.label.toLowerCase()} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Budget rail */}
      <section className="mx-auto max-w-7xl px-6 pb-2">
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">💸 Budget-friendly escapes</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {budget.slice(0, 8).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Luxury rail */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">👑 Indulge in luxury</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {luxury.slice(0, 8).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Regions */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Explore by region</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {REGIONS.map((r) => (
            <Link
              key={r.name}
              href={`/listings?region=${encodeURIComponent(r.name)}`}
              className="card-zoom group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.image}
                alt={r.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-lg font-bold leading-tight">{r.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-white/80">{r.blurb}</p>
                <p className="mt-1 text-xs font-semibold text-rose-200">
                  {regionCounts[r.name] ?? 0} stays
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Diani popular spots */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-1 text-2xl font-bold sm:text-3xl">Diani: stay near popular spots</h2>
        <p className="mb-6 text-slate-500">
          Real Diani landmarks — find an Airbnb on the doorstep of each.
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {DIANI_SPOTS.map((s) => (
            <Link
              key={s.name}
              href={`/listings?q=${encodeURIComponent(s.q)}`}
              className="flex items-end overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-500 to-cyan-600 p-5 text-white transition hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-bold leading-tight">{s.name}</h3>
                <p className="text-xs text-white/85">{s.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-fog">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Why book with SafariStay</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🦁", title: "Right beside the wild", body: "Stays minutes from the Mara, Amboseli, Nakuru, Samburu and Tsavo — the Big Five on your doorstep." },
              { icon: "🧭", title: "Local Maasai & Samburu hosts", body: "Book directly with rangers, guides and community-run conservancies who know the land best." },
              { icon: "🛡️", title: "Verified & flexible", body: "Real reviews, transparent KES pricing and free cancellation options on most stays." },
              { icon: "🌱", title: "Travel that gives back", body: "Every booking supports conservation fees and community tourism across Kenya." },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-3xl">{v.icon}</div>
                <h3 className="mt-3 font-bold">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="brand-bg">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-12 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Host your home, villa or camp</h2>
            <p className="mt-1 text-white/85">Share your corner of Kenya with travellers from around the world.</p>
          </div>
          <Link
            href="/listings"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-xl"
          >
            Start hosting
          </Link>
        </div>
      </section>
    </>
  );
}
