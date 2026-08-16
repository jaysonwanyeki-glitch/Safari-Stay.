import Link from "next/link";
import { SITE_TYPE_EMOJI, siteDirectory, type SiteType } from "@/lib/nearby";
import { getListings } from "@/lib/data";
import type { TKey } from "@/lib/i18n";
import { T } from "@/components/Localized";

export const dynamic = "force-dynamic";

const SITE_ORDER: SiteType[] = [
  "conservancy",
  "national_park",
  "marine",
  "forest",
  "beach",
  "lake",
  "waterfall",
  "cultural",
  "historical",
  "viewpoint",
  "town",
];

export default async function SitesDirectoryPage() {
  const [listings, dir] = await Promise.all([getListings(), Promise.resolve(siteDirectory())]);
  const bySlug = new Map(listings.map((l) => [l.slug, l]));

  const grouped = SITE_ORDER.map((type) => ({
    type,
    sites: dir.filter((s) => s.type === type),
  })).filter((g) => g.sites.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <nav className="mb-3 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          <T k="detail.home" />
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">
          <T k="sites.title" />
        </span>
      </nav>

      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        🦁 <T k="sites.title" />
      </h1>
      <p className="mt-1 max-w-2xl text-sand-600">
        <T k="sites.sub" />
      </p>

      {/* Quick nav by type */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {grouped.map((g) => (
          <a
            key={g.type}
            href={`#${g.type}`}
            className="shrink-0 rounded-full border border-sand-400 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-brand hover:text-brand"
          >
            {SITE_TYPE_EMOJI[g.type]} <T k={`site.${g.type}` as TKey} />{" "}
            <span className="text-sand-500">({g.sites.length})</span>
          </a>
        ))}
      </div>

      {grouped.map((g) => (
        <section key={g.type} id={g.type} className="mt-9 scroll-mt-24">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <span>{SITE_TYPE_EMOJI[g.type]}</span>
            <T k={`site.${g.type}` as TKey} />
            <span className="text-sm font-normal text-sand-500">({g.sites.length})</span>
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.sites.map((s) => {
              const stays = s.slugs.map((slug) => bySlug.get(slug)).filter((l) => l !== undefined);
              return (
                <div key={s.name} className="flex flex-col rounded-2xl border border-sand-200 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="rounded-full bg-ember-50 px-2.5 py-0.5 text-[11px] font-bold text-brand">
                      <T k={`site.${s.type}` as TKey} />
                    </span>
                  </div>
                  <Link
                    href={`/listings?near=${encodeURIComponent(s.name)}`}
                    className="mt-2 block text-sm font-bold leading-snug transition hover:text-brand hover:underline"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-0.5 text-xs font-semibold text-brand">📍 {s.distance}</p>
                  <p className="mt-1.5 text-xs leading-snug text-sand-600">{s.blurb}</p>
                  {stays.length > 0 && (
                    <div className="mt-3 border-t border-sand-100 pt-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-sand-500">
                        <T k="sites.nearbyStays" />
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {stays.map((l) => (
                          <li key={l.id}>
                            <Link
                              href={`/listings/${l.slug}`}
                              className="text-xs font-semibold text-ink transition hover:text-brand hover:underline"
                            >
                              → {l.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
