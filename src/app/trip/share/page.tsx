import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/Localized";
import { decodeTrip, type Trip } from "@/lib/trip";
import { getListings, type PublicListing } from "@/lib/data";
import { formatKes } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shared trip · SafariStay Kenya",
  description: "A day-by-day Kenyan route planned on SafariStay — shared by a fellow traveller.",
};

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

type Row = { id: number; day: number; nights: number; listing: PublicListing };

function buildRows(trip: Trip, listings: PublicListing[]): Row[] {
  const byId = new Map(listings.map((l) => [l.id, l]));
  return trip.items
    .map((it) => ({ ...it, listing: byId.get(it.id) }))
    .filter((r): r is Row => !!r.listing);
}

export default async function TripSharePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.t === "string" ? sp.t : "";
  const trip = decodeTrip(raw);

  if (!trip) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-16 text-center sm:px-6">
        <div className="rounded-3xl border border-sand-200 bg-white p-10 shadow-sm">
          <div className="text-5xl">🧭</div>
          <h1 className="font-display mt-4 text-2xl font-bold text-ink">
            <T k="trip.shareInvalid" />
          </h1>
          <p className="mt-2 text-sm text-sand-700">
            <T k="trip.shareInvalidSub" />
          </p>
          <Link
            href="/trip"
            className="brand-bg mt-6 inline-block rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg"
          >
            <T k="trip.shareBuild" />
          </Link>
        </div>
      </div>
    );
  }

  const listings = await getListings();
  const rows = buildRows(trip, listings);
  const dayMap = new Map<number, Row[]>();
  for (const r of rows) {
    if (r.day === 0) continue;
    const list = dayMap.get(r.day) ?? [];
    list.push(r);
    dayMap.set(r.day, list);
  }
  const dayNumbers = [...dayMap.keys()].sort((a, b) => a - b);
  const unscheduled = rows.filter((r) => r.day === 0);
  const totalNights = rows.reduce((s, r) => s + r.nights, 0);
  const estimate = rows.reduce((s, r) => s + r.listing.pricePerNight * r.nights, 0);
  const title = trip.name.trim() || "trip";

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">{title}</span>
      </nav>

      <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
          <T k="trip.shareName" />
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">
          {trip.name.trim() || <T k="trip.shareName" />}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-extrabold text-ink">
            <T k="trip.stays" vars={{ n: rows.length }} />
          </span>
          <span className="text-sand-400" aria-hidden>
            ·
          </span>
          <span className="font-extrabold text-ink">
            <T k="trip.nights" vars={{ n: totalNights }} />
          </span>
          <span className="text-sand-400" aria-hidden>
            ·
          </span>
          <span className="font-extrabold text-brand">
            <T k="trip.estFrom" vars={{ n: formatKes(estimate) }} />
          </span>
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {dayNumbers.map((day, i) => (
          <div key={day}>
            <div className="flex items-center gap-3">
              <span className="brand-bg grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white">
                {day}
              </span>
              <h2 className="font-bold text-ink">
                <T k="trip.day" vars={{ n: day }} />
              </h2>
              {i < dayNumbers.length - 1 && (
                <span className="text-sm text-sand-500" aria-hidden>
                  ↓
                </span>
              )}
            </div>
            <div className="mt-3 space-y-3">
              {dayMap.get(day)!.map((r) => (
                <div
                  key={r.listing.id}
                  className="flex flex-col gap-3 rounded-2xl border border-sand-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
                >
                  <Link href={`/listings/${r.listing.slug}`} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.listing.imageUrls[0]}
                      alt={r.listing.title}
                      loading="lazy"
                      className="h-24 w-full rounded-xl object-cover sm:h-16 sm:w-24"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/listings/${r.listing.slug}`}
                      className="font-bold text-ink transition hover:text-brand"
                    >
                      {r.listing.title}
                    </Link>
                    <p className="text-xs text-sand-600">
                      {r.listing.locationName}
                      {r.listing.county ? ` · ${r.listing.county}` : ""}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-brand">
                      {formatKes(r.listing.pricePerNight)}{" "}
                      <span className="text-xs font-normal text-sand-500">
                        <T k="trip.perNight" />
                      </span>{" "}
                      · <T k="trip.nights" vars={{ n: r.nights }} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {unscheduled.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-sand-300 bg-white/60 p-5">
          <h3 className="font-bold text-ink">
            <T k="trip.unscheduled" />
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {unscheduled.map((r) => (
              <Link
                key={r.listing.id}
                href={`/listings/${r.listing.slug}`}
                className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                {r.listing.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/trip"
          className="brand-bg inline-block rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
        >
          <T k="trip.shareMakeOwn" /> →
        </Link>
      </div>
    </div>
  );
}
