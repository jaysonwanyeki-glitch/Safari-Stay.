import Link from "next/link";
import { ACTIVITY_EMOJI, activityDirectory } from "@/lib/activities";
import { getListings } from "@/lib/data";
import type { TKey } from "@/lib/i18n";
import { T } from "@/components/Localized";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fun things to do in Kenya — activities near your stay · SafariStay",
  description:
    "Adventure tours, skating rinks, horse riding, hikes, water parks, cooking classes and volunteering with the Red Cross and St John Ambulance — real activities across Kenya, with the stays beside them.",
};

export default async function ActivitiesPage() {
  const [listings, grouped] = await Promise.all([getListings(), Promise.resolve(activityDirectory())]);
  const bySlug = new Map(listings.map((l) => [l.slug, l]));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <nav className="mb-3 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          <T k="detail.home" />
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">
          <T k="activities.title" />
        </span>
      </nav>

      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        🎉 <T k="activities.title" />
      </h1>
      <p className="mt-1 max-w-2xl text-sand-600">
        <T k="activities.sub" />
      </p>

      {/* Quick nav by category */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {grouped.map((g) => (
          <a
            key={g.category}
            href={`#${g.category}`}
            className="shrink-0 rounded-full border border-sand-400 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-brand hover:text-brand"
          >
            {ACTIVITY_EMOJI[g.category]} <T k={`act.${g.category}` as TKey} />{" "}
            <span className="text-sand-500">({g.items.length})</span>
          </a>
        ))}
      </div>

      {grouped.map((g) => (
        <section key={g.category} id={g.category} className="mt-9 scroll-mt-24">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <span>{ACTIVITY_EMOJI[g.category]}</span>
            <T k={`act.${g.category}` as TKey} />
            <span className="text-sm font-normal text-sand-500">({g.items.length})</span>
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((x) => {
              const stays = x.staysNear.map((slug) => bySlug.get(slug)).filter((l) => l !== undefined);
              return (
                <div key={x.id} id={x.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-sand-200 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{x.emoji}</span>
                    <span className="rounded-full bg-ember-50 px-2.5 py-0.5 text-[11px] font-bold text-brand">
                      <T k={`act.${x.category}` as TKey} />
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold leading-snug text-ink">{x.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-sand-600">📍 {x.location}</p>
                  {x.cost && <p className="mt-0.5 text-xs font-semibold text-emerald-700">💵 {x.cost}</p>}
                  <p className="mt-1.5 text-xs leading-snug text-sand-600">{x.blurb}</p>
                  {stays.length > 0 && (
                    <div className="mt-3 border-t border-sand-100 pt-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-sand-500">
                        <T k="activities.staysNear" />
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

      <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
        <h2 className="font-display text-lg font-bold text-emerald-900">
          ❤️ <T k="activities.volunteerTitle" />
        </h2>
        <p className="mt-1 text-sm text-emerald-900/80">
          <T k="activities.volunteerSub" />
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
          <Link href="/activities#kenya-red-cross" className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700">
            Kenya Red Cross
          </Link>
          <Link href="/activities#st-john-ambulance-kenya" className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700">
            St John Ambulance Kenya
          </Link>
          <Link href="/activities#local-ocean-trust-watamu" className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700">
            Turtle patrols — Watamu
          </Link>
          <Link href="/activities#colobus-conservation-diani" className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700">
            Colobus Conservation — Diani
          </Link>
        </div>
      </div>
    </div>
  );
}
