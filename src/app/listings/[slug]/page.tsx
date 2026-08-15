import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import BookingWidget from "@/components/BookingWidget";
import AvailabilityStrip from "@/components/AvailabilityStrip";
import SingleMap from "@/components/SingleMap";
import ListingCard from "@/components/ListingCard";
import WishlistButton from "@/components/WishlistButton";
import Occupancy from "@/components/Occupancy";
import { MapPinIcon, ShareIcon, StarIcon } from "@/components/icons";
import { AMENITY_GROUPS, placeLabel, stimaMaji, waLink } from "@/lib/constants";
import { formatKes } from "@/lib/format";
import { T } from "@/components/Localized";
import {
  getBookedRanges,
  getListingBySlug,
  getNearbyListings,
  getReviewsForListing,
} from "@/lib/data";
import { getWeather } from "@/lib/weather";
import { formatUsd, kesToUsd } from "@/lib/currency";
import { SEASON_EMOJI, SEASON_LABEL, seasonForDate } from "@/lib/seasons";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Stay not found · SafariStay" };
  return {
    title: `${listing.title} · ${listing.locationName} · SafariStay`,
    description: listing.description.slice(0, 160),
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const [reviews, nearby, bookedRanges] = await Promise.all([
    getReviewsForListing(listing.id),
    getNearbyListings(listing, 4),
    getBookedRanges(listing.id),
  ]);

  const [weather, usdNightly] = await Promise.all([
    getWeather(listing.latitude, listing.longitude),
    kesToUsd(listing.pricePerNight),
  ]);
  const season = seasonForDate(new Date());

  const place = placeLabel(listing.roomType, listing.propertyType);
  const marker = {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    pricePerNight: listing.pricePerNight,
    latitude: listing.latitude,
    longitude: listing.longitude,
  };

  // Plausible rating distribution derived from the average.
  const five = Math.min(95, Math.round((listing.rating - 4) * 100));
  const rest = 100 - five;
  const four = Math.round(rest * 0.7);
  const three = Math.round(rest * 0.2);
  const two = Math.round(rest * 0.07);
  const one = Math.max(0, rest - four - three - two);
  const dist = [
    { stars: 5, pct: five },
    { stars: 4, pct: four },
    { stars: 3, pct: three },
    { stars: 2, pct: two },
    { stars: 1, pct: one },
  ];

  const amenityGroups = AMENITY_GROUPS.map((g) => ({
    ...g,
    items: listing.amenities.filter((a) => g.match.test(a)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          <T k="detail.home" />
        </Link>
        <span>›</span>
        <Link href={`/listings?region=${encodeURIComponent(listing.region)}`} className="hover:underline">
          {listing.region}
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">{listing.title}</span>
      </nav>

      {/* Title block */}
      <div className="flex flex-col gap-3 border-b border-sand-200 pb-5">
        <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{listing.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="flex items-center gap-1 font-semibold">
              <StarIcon className="h-4 w-4" />
              {listing.rating.toFixed(2)}
            </span>
            <span>·</span>
            <span className="font-semibold underline">{listing.reviewsCount} reviews</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-sand-700">
              <MapPinIcon className="h-4 w-4" />
              {listing.locationName}, {listing.county ?? listing.region}
            </span>
            {listing.superhost && (
              <span className="rounded-full bg-ember-50 px-2 py-0.5 text-xs font-bold text-brand">
                🏆 <T k="superhost" />
              </span>
            )}
            <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs font-bold text-ink">
              {SEASON_EMOJI[season]} {SEASON_LABEL[season]}
            </span>
            {usdNightly > 0 && (
              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-ink">
                ≈ {formatUsd(usdNightly)}/night
              </span>
            )}
            {listing.monthlyDiscountPct > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                📅 <T k="detail.monthlyBadge" />
              </span>
            )}
            {listing.groupDiscountPct > 0 && (
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700">
                👥 <T k="detail.groupBadge" />
              </span>
            )}
            {listing.airportTransferKes > 0 && (
              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-ink">
                <T k="detail.transferChip" vars={{ n: formatKes(listing.airportTransferKes) }} />
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold underline hover:bg-sand-100">
              <ShareIcon className="h-4 w-4" /> <T k="detail.share" />
            </button>
            <WishlistButton id={listing.id} label />
          </div>
        </div>
      </div>

      <Gallery images={listing.imageUrls} title={listing.title} />

      {/* Two columns */}
      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          {/* Host summary */}
          <div className="border-b border-sand-200 pb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">
                  <T k="detail.hostedBy" vars={{ place, host: listing.hostName }} />
                </h2>
                <p className="mt-1 text-sm text-sand-700">
                  <Occupancy
                    guests={listing.maxGuests}
                    bedrooms={listing.bedrooms}
                    beds={listing.beds}
                    baths={listing.bathrooms}
                  />
                </p>
              </div>
              <div className="brand-bg grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-xl font-bold text-white">
                {listing.hostName.charAt(0)}
              </div>
            </div>
            {listing.hostBio && (
              <p className="mt-3 text-sm text-sand-700">
                <span className="font-semibold">
                  <T k="detail.meetHost" />
                </span>
                {listing.hostBio} <T k="detail.since" vars={{ year: listing.hostSince }} />
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {waLink(listing) && (
                <a
                  href={waLink(listing)!}
                  target="_blank"
                  rel="noreferrer"
                  title={"Demo host line — replace with the real number"}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow transition hover:brightness-95"
                >
                  💬 <T k="widget.contactHost" />
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                ✅ <T k="detail.verifiedHost" />
              </span>
            </div>
          </div>

          {/* Highlights */}
          {listing.highlights && listing.highlights.length > 0 && (
            <div className="border-b border-sand-200 py-6">
              <h3 className="mb-3 text-lg font-bold">
                <T k="detail.special" />
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {listing.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span className="text-brand">✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="border-b border-sand-200 py-6">
            <p className="text-[15px] leading-relaxed text-sand-800">{listing.description}</p>
            <p className="mt-4 text-sm text-sand-600">
              <T k="detail.greenRate" />{" "}
              <span className="font-semibold text-ink">{formatKes(listing.pricePerNight)}</span>{" "}
              <T k="widget.night" /> · <T k="detail.peakSeason" />{" "}
              <span className="font-semibold text-ink">{formatKes(listing.peakPricePerNight)}</span>
              {listing.cleaningFee > 0 ? (
                <>
                  {" "}· <T k="widget.cleaningFee" /> {formatKes(listing.cleaningFee)}
                </>
              ) : null}
              .
            </p>
          </div>

          {/* Live weather */}
          {weather && (
            <div className="border-b border-sand-200 py-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-sand-200 bg-white/70 p-4">
                <div>
                  <p className="text-sm font-bold">
                    <T k="detail.weatherTitle" /> {listing.locationName}
                  </p>
                  <p className="mt-0.5 text-sm text-sand-700">
                    {weather.icon} {weather.label} ·{" "}
                    <T k="detail.weatherMeta" vars={{ h: weather.humidity, w: weather.wind }} />
                  </p>
                </div>
                <p className="font-display text-4xl font-bold text-ink">{weather.temp}°</p>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="border-b border-sand-200 py-6">
            <h3 className="mb-4 text-lg font-bold">
              <T k="detail.offers" />
            </h3>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {amenityGroups.map((g) => (
                <div key={g.title}>
                  <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                    <span className="text-lg">{g.icon}</span>
                    {g.title}
                  </p>
                  <ul className="space-y-1 text-sm text-sand-700">
                    {g.items.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Stima & Maji — honest utilities */}
          <div className="border-b border-sand-200 py-6">
            <h3 className="text-lg font-bold">
              <T k="detail.stimaTitle" />
            </h3>
            <p className="mt-1 text-sm text-sand-600">
              <T k="detail.stimaSub" />
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {stimaMaji(listing).map((u) => (
                <div key={u.key} className="rounded-xl border border-sand-200 bg-white/70 p-4">
                  <div className="text-2xl">{u.icon}</div>
                  <p className="mt-2 text-sm font-bold">{u.label}</p>
                  <p className="mt-1 text-xs leading-snug text-sand-600">{u.honest}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking widget + availability strip */}
        <div>
          <div className="sticky top-24">
            <BookingWidget listing={listing} />
            <p className="mt-3 text-center text-xs text-sand-600">
              <T k="widget.demoNote" />
            </p>
          </div>
          <div className="mt-6">
            <AvailabilityStrip ranges={bookedRanges} listingId={listing.id} />
          </div>
        </div>
      </div>

      {/* Map */}
      <section className="border-t border-sand-200 py-8">
        <h2 className="mb-1 font-display text-xl font-bold">
          <T k="detail.whereTitle" />
        </h2>
        {listing.landmark && (
          <p className="mb-2 inline-block rounded-full bg-ember-50 px-3 py-1 text-sm font-bold text-brand">
            📍 <T k="detail.near" /> {listing.landmark}
          </p>
        )}
        <p className="mb-4 text-sm text-sand-700">
          {listing.locationName}, {listing.region}, Kenya. <T k="detail.pinNote" />
        </p>
        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noreferrer"
            className="mb-4 inline-block text-sm font-semibold text-brand underline hover:text-brand-dark"
          >
            <T k="detail.website" />
          </a>
        )}
        <SingleMap point={marker} />
      </section>

      {/* Reviews */}
      <section className="border-t border-sand-200 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <StarIcon className="h-5 w-5" />
            {listing.rating.toFixed(2)} · {listing.reviewsCount} reviews
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div className="space-y-2">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-sm">
                <span className="w-3">{d.stars}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-200">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {reviews.length === 0 ? (
              <p className="text-sm text-sand-600">
                <T k="detail.reviewsEmpty" />
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r.id}>
                  <div className="flex items-center gap-3">
                    {r.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.avatar} alt={r.guestName} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="brand-bg grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white">
                        {r.guestName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold">{r.guestName}</p>
                      <p className="text-xs text-sand-600">{r.stayedOn}</p>
                    </div>
                  </div>
                  <div className="mt-1 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "text-ink" : "text-sand-300"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-sand-800">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Things to know */}
      <section className="border-t border-sand-200 py-8">
        <h2 className="mb-4 font-display text-xl font-bold">
          <T k="detail.thingsTitle" />
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-bold">
              <T k="detail.houseRules" />
            </h3>
            <ul className="space-y-1 text-sm text-sand-700">
              <li>
                <T k="search.checkIn" /> from {listing.checkInTime}
              </li>
              <li>
                <T k="search.checkOut" /> by {listing.checkOutTime}
              </li>
              <li>
                <T k="house.maxGuests" vars={{ n: listing.maxGuests }} />
              </li>
              <li>
                <T k="house.noSmoking" />
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-bold">
              <T k="detail.health" />
            </h3>
            <ul className="space-y-1 text-sm text-sand-700">
              <li>
                <T k="health.trainedGuides" />
              </li>
              <li>
                <T k="health.malaria" />
              </li>
              <li>
                <T k="health.firstAid" />
              </li>
              <li>
                <T k="health.wildlife" />
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-bold">
              <T k="detail.cancellation" />
            </h3>
            <ul className="space-y-1 text-sm text-sand-700">
              <li>
                <T k="detail.freeCancel" /> — <T k="bookings.refundNote" />
              </li>
              <li>
                <T k="cancel.reviewPolicy" />
              </li>
              <li>
                <T k="cancel.parkFees" />
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="border-t border-sand-200 py-8">
        <h2 className="mb-5 font-display text-xl font-bold">
          <T k="detail.nearbyTitle" />
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {nearby.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>
    </div>
  );
}
