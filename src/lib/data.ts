import { db } from "@/db";
import { listings, reviews } from "@/db/schema";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
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
};

export type PublicReview = {
  id: number;
  guestName: string;
  avatar: string | null;
  rating: number;
  comment: string;
  stayedOn: string;
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
  q?: string;
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
  if (filter.q && filter.q.trim()) {
    const term = `%${filter.q.trim()}%`;
    conditions.push(
      or(
        ilike(listings.title, term),
        ilike(listings.locationName, term),
        ilike(listings.region, term),
        ilike(listings.description, term),
        ilike(listings.landmark, term),
      )!,
    );
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

  return rows.map(toPublic);
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
