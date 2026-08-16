import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import ListingToolbar from "@/components/ListingToolbar";
import { T } from "@/components/Localized";
import ResultsMap from "@/components/ResultsMap";
import { getListings, toMarkers } from "@/lib/data";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const filter = {
    region: pick("region"),
    type: pick("type"),
    tier: pick("tier"),
    guests: Number(pick("guests") ?? 0) || undefined,
    minPrice: Number(pick("minPrice") ?? 0) || undefined,
    maxPrice: Number(pick("maxPrice") ?? 0) || undefined,
    q: pick("q"),
    near: pick("near"),
    sort: pick("sort") as
      | "recommended"
      | "price_asc"
      | "price_desc"
      | "rating"
      | "reviews"
      | undefined,
  };

  const items = await getListings(filter);
  const markers = toMarkers(items);

  const toolbarParams: Record<string, string | undefined> = {
    region: pick("region"),
    type: pick("type"),
    tier: pick("tier"),
    guests: pick("guests"),
    minPrice: pick("minPrice"),
    maxPrice: pick("maxPrice"),
    sort: pick("sort"),
    q: pick("q"),
    near: pick("near"),
  };

  const heading = filter.region
    ? `${filter.region}`
    : filter.near
      ? <T k="listings.nearHeading" vars={{ place: filter.near }} />
      : filter.type === "all"
        ? "All stays in Kenya"
        : "Stays in Kenya";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="pt-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{heading}</h1>
        <p className="mt-1 text-sand-600">
          Beachfront villas, bush homes, cottages and hosted camps near Kenya&apos;s wildlife reserves.
        </p>
      </div>

      <ListingToolbar params={toolbarParams} count={items.length} />

      <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_420px]">
        <div>
          {items.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-sand-400 py-24 text-center">
              <div className="text-5xl">🦓</div>
              <h2 className="mt-3 text-xl font-bold">No stays match your filters</h2>
              <p className="mt-1 text-sand-600">Try widening your search or clearing filters.</p>
              <Link
                href="/listings"
                className="mt-4 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>

        <ResultsMap markers={markers} />
      </div>
    </div>
  );
}
