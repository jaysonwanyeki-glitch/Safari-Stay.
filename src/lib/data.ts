import { db } from "@/db";
import { bookings, listings, reviews } from "@/db/schema";
import { haversineKm, matchesNear, siteCoordsFor } from "@/lib/nearby";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  lte,
  ne,
  sql,
  type SQL,
} from "drizzle-orm";

/** A listing with numeric fields parsed for clean client usage. */
export type PublicListing = {
  id: number;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  roomType: string;
  priceTier: string;
  landmark: string | null;
  hostName: string;
  hostSince: number;
  hostBio: string | null;
  superhost: boolean;
  hostPhone: string | null;
  powerBackup: string;
  waterSource: string;
  wifiType: string;
  monthlyDiscountPct: number;
  groupDiscountPct: number;
  airportTransferKes: number;
  pricePerNight: number;
  peakPricePerNight: number;
  cleaningFee: number;
  checkInTime: string;
  checkOutTime: string;
  website: string | null;
  locationName: string;
  region: string;
  county: string | null;
  latitude: number;
  longitude: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  highlights: string[] | null;
  imageUrls: string[];
  rating: number;
  reviewsCount: number;
  featured: boolean;
  /** Straight-line distance to the searched place (km) — set by radius search. */
  distanceKm?: number;
};

export type PublicReview = {
  id: number;
  guestName: string;
  avatar: string | null;
  photo: string | null;
  rating: number;
  comment: string;
  stayedOn: string;
};

export type BookedRange = {
  checkIn: string;
  checkOut: string;
};

export type ListingMarker = {
  id: number;
  slug: string;
  title: string;
  pricePerNight: number;
  latitude: number;
  longitude: number;
};

export type ListSort =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "reviews";

export type ListFilter = {
  region?: string;
  type?: string;
  tier?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  /** Free-text search — matches titles, places AND nearby conservancies/sites. */
  q?: string;
  /** "Near" filter — matches the listing's nearby conservancies & sites. */
  near?: string;
  sort?: ListSort;
};

type ListingRow = typeof listings.$inferSelect;

function toPublic(row: ListingRow): PublicListing {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    propertyType: row.propertyType,
    roomType: row.roomType,
    priceTier: row.priceTier,
    landmark: row.landmark,
    hostName: row.hostName,
    hostSince: row.hostSince,
    hostBio: row.hostBio,
    superhost: row.superhost,
    hostPhone: row.hostPhone,
    powerBackup: row.powerBackup,
    waterSource: row.waterSource,
    wifiType: row.wifiType,
    monthlyDiscountPct: row.monthlyDiscountPct,
    groupDiscountPct: row.groupDiscountPct,
    airportTransferKes: row.airportTransferKes,
    pricePerNight: row.pricePerNight,
    peakPricePerNight: row.peakPricePerNight,
    cleaningFee: row.cleaningFee,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    website: row.website,
    locationName: row.locationName,
    region: row.region,
    county: row.county,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: Number(row.bathrooms),
    maxGuests: row.maxGuests,
    amenities: row.amenities ?? [],
    highlights: row.highlights ?? null,
    imageUrls: row.imageUrls ?? [],
    rating: Number(row.rating),
    reviewsCount: row.reviewsCount,
    featured: row.featured,
  };
}

export async function getListings(filter: ListFilter = {}): Promise<PublicListing[]> {
  const conditions: SQL[] = [];

  if (filter.region && filter.region !== "all") {
    conditions.push(eq(listings.region, filter.region));
  }
  if (filter.type && filter.type !== "all") {
    conditions.push(eq(listings.propertyType, filter.type));
  }
  if (filter.tier && filter.tier !== "all") {
    conditions.push(eq(listings.priceTier, filter.tier));
  }
  if (filter.guests && filter.guests > 0) {
    conditions.push(gte(listings.maxGuests, filter.guests));
  }
  if (filter.minPrice && filter.minPrice > 0) {
    conditions.push(gte(listings.pricePerNight, filter.minPrice));
  }
  if (filter.maxPrice && filter.maxPrice > 0) {
    conditions.push(lte(listings.pricePerNight, filter.maxPrice));
  }
  const sort = filter.sort ?? "recommended";
  const orderBys: SQL[] = [];
  switch (sort) {
    case "price_asc":
      orderBys.push(asc(listings.pricePerNight));
      break;
    case "price_desc":
      orderBys.push(desc(listings.pricePerNight));
      break;
    case "rating":
      orderBys.push(desc(listings.rating), desc(listings.reviewsCount));
      break;
    case "reviews":
      orderBys.push(desc(listings.reviewsCount));
      break;
    default:
      orderBys.push(desc(listings.featured), desc(listings.rating), desc(listings.reviewsCount));
  }

  const rows = await db
    .select()
    .from(listings)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...orderBys);

  let items = rows.map(toPublic);

  // Text & "near" matching runs in memory against the full row set — the
  // catalogue is small and the nearby sites live in code (src/lib/nearby.ts),
  // not the database. Free-text q also matches conservancy/site names, so
  // "Naboisho" or "Hells Gate" in the search box finds the stays near them.
  const q = filter.q?.trim().toLowerCase();
  if (q) {
    items = items.filter((l) =>
      [l.title, l.locationName, l.region, l.county ?? "", l.landmark ?? "", l.description]
        .some((f) => f.toLowerCase().includes(q)) || matchesNear(l.slug, q),
    );
  }
  // "Near …" radius search. When the place has coordinates, results are the
  // stays whose curated nearby-sites list mentions it (the honest "this stay is
  // beside it" links) PLUS any stay within ~12 km of the place — sorted by
  // distance, so the closest appear first. If nothing is within range, we fall
  // back to the closest stays in the whole catalogue so the search still helps.
  const near = filter.near?.trim().toLowerCase();
  if (near) {
    const coords = siteCoordsFor(near);
    const withDist = items.map((l) => ({
      ...l,
      distanceKm: coords ? haversineKm(coords, { lat: l.latitude, lng: l.longitude }) : undefined,
    }));
    const curated = withDist.filter(
      (l) =>
        matchesNear(l.slug, near) ||
        (l.landmark ?? "").toLowerCase().includes(near) ||
        l.locationName.toLowerCase().includes(near),
    );
    if (coords) {
      const seen = new Set(curated.map((l) => l.id));
      const within = withDist.filter(
        (l) => !seen.has(l.id) && l.distanceKm != null && l.distanceKm <= 12,
      );
      let result = [...curated, ...within];
      if (result.length === 0) {
        // Nothing within ~12 km — suggest the closest stays to the place.
        result = [...withDist]
          .sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9))
          .slice(0, 5);
      }
      result.sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
      items = result;
    } else {
      items = curated;
    }
  }

  return items;
}

export async function getFeaturedListings(limit = 8): Promise<PublicListing[]> {
  const rows = await db
    .select()
    .from(listings)
    .where(eq(listings.featured, true))
    .orderBy(desc(listings.rating))
    .limit(limit);
  return rows.map(toPublic);
}

/** Cheapest stays first — powers the "Budget" rail. */
export async function getBudgetListings(limit = 8): Promise<PublicListing[]> {
  const rows = await db
    .select()
    .from(listings)
    .orderBy(asc(listings.pricePerNight))
    .limit(limit);
  return rows.map(toPublic);
}

/** Premium stays — powers the "Luxury" rail. */
export async function getLuxuryListings(limit = 8): Promise<PublicListing[]> {
  const rows = await db
    .select()
    .from(listings)
    .where(eq(listings.priceTier, "luxury"))
    .orderBy(desc(listings.rating))
    .limit(limit);
  return rows.map(toPublic);
}

export async function getListingBySlug(slug: string): Promise<PublicListing | null> {
  const rows = await db.select().from(listings).where(eq(listings.slug, slug)).limit(1);
  if (rows.length === 0) return null;
  return toPublic(rows[0]);
}

/** All booking date ranges for a listing — powers the availability strip.
 * Cancelled bookings are excluded: cancelling frees the dates again. */
export async function getBookedRanges(listingId: number): Promise<BookedRange[]> {
  const rows = await db
    .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
    .from(bookings)
    .where(and(eq(bookings.listingId, listingId), ne(bookings.status, "cancelled")));
  return rows;
}


export async function getReviewsForListing(listingId: number): Promise<PublicReview[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.listingId, listingId))
    .orderBy(desc(reviews.id));
  return rows.map((r) => ({
    id: r.id,
    guestName: r.guestName,
    avatar: r.avatar,
    photo: r.photo,
    rating: r.rating,
    comment: r.comment,
    stayedOn: r.stayedOn,
  }));
}

export async function getNearbyListings(
  listing: PublicListing,
  limit = 4,
): Promise<PublicListing[]> {
  const rows = await db
    .select()
    .from(listings)
    .where(eq(listings.region, listing.region))
    .orderBy(desc(listings.rating))
    .limit(limit + 1);

  const filtered = rows
    .filter((r) => r.id !== listing.id)
    .map(toPublic)
    .slice(0, limit);

  if (filtered.length >= limit) return filtered;

  const extra = await db
    .select()
    .from(listings)
    .orderBy(desc(listings.rating))
    .limit(limit * 2);

  const seen = new Set<number>([listing.id, ...filtered.map((f) => f.id)]);
  for (const r of extra) {
    if (filtered.length >= limit) break;
    if (!seen.has(r.id)) {
      filtered.push(toPublic(r));
      seen.add(r.id);
    }
  }
  return filtered;
}

export async function getRegionCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      region: listings.region,
      count: sql<number>`count(*)::int`,
    })
    .from(listings)
    .groupBy(listings.region);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.region] = r.count;
  return map;
}

export async function getListingStats(): Promise<{ stays: number; regions: number; parks: number }> {
  const row = await db
    .select({ stays: sql<number>`count(*)::int` })
    .from(listings);
  const regionRow = await db
    .select({ count: sql<number>`count(distinct ${listings.region})::int` })
    .from(listings);
  const parkRow = await db
    .select({ count: sql<number>`count(distinct ${listings.locationName})::int` })
    .from(listings);
  return {
    stays: row[0]?.stays ?? 0,
    regions: regionRow[0]?.count ?? 0,
    parks: parkRow[0]?.count ?? 0,
  };
}

export function toMarkers(items: PublicListing[]): ListingMarker[] {
  return items.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    pricePerNight: l.pricePerNight,
    latitude: l.latitude,
    longitude: l.longitude,
  }));
}
