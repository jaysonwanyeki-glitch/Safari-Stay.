import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings, listings } from "@/db/schema";
import { and, desc, eq, gt, ilike, lt, ne, sql } from "drizzle-orm";
import { bookingRef } from "@/lib/format";

export const dynamic = "force-dynamic";

export type BookingStatus =
  | "upcoming"
  | "active"
  | "completed"
  | "pending"
  | "cancelled";

export type PaymentMethod = "mpesa" | "property";

/** Kenyan phone: +2547XXXXXXXX or 07XXXXXXXX (Safaricom/Airtel/Telkom). */
function validKenyanPhone(phone: string): boolean {
  return /^(\+254|0)7\d{8}$/.test(phone.replace(/[\s-]/g, ""));
}

/** Public display status: stored payment status wins; confirmed stays are date-derived. */
function displayStatus(b: {
  status: string;
  checkIn: string;
  checkOut: string;
}): BookingStatus {
  if (b.status === "cancelled") return "cancelled";
  if (b.status === "pending") return "pending";
  const today = new Date().toISOString().slice(0, 10);
  if (b.checkOut <= today) return "completed";
  if (b.checkIn <= today) return "active";
  return "upcoming";
}

/** Parse a "SS-00012" reference into a booking id (SS-12 and SS-00012 both work). */
function refToId(ref: string): number | null {
  const m = /^SS-(\d+)$/i.exec(ref.trim());
  if (!m) return null;
  const id = Number(m[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Look up confirmed bookings by SS reference code and/or the guest email. */
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref") ?? "";
  const email = (req.nextUrl.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!ref.trim() && !email) {
    return Response.json({ error: "Provide a reference code or email" }, { status: 400 });
  }

  const conditions = [];
  const id = ref.trim() ? refToId(ref) : null;
  if (ref.trim() && id === null) {
    return Response.json({ error: "That reference code looks invalid" }, { status: 400 });
  }
  if (id !== null) conditions.push(eq(bookings.id, id));
  if (email) conditions.push(ilike(bookings.guestEmail, email));

  const rows = await db
    .select({
      id: bookings.id,
      listingId: bookings.listingId,
      guestName: bookings.guestName,
      guestEmail: bookings.guestEmail,
      guestPhone: bookings.guestPhone,
      guestVerified: bookings.guestVerified,
      paymentMethod: bookings.paymentMethod,
      status: bookings.status,
      transferRequested: bookings.transferRequested,
      transferFee: bookings.transferFee,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      guests: bookings.guests,
      nights: bookings.nights,
      totalKes: bookings.totalKes,
      createdAt: bookings.createdAt,
      listingTitle: listings.title,
      listingSlug: listings.slug,
      listingImage: sql<string>`${listings.imageUrls}[1]`,
      listingLocation: listings.locationName,
      listingRegion: listings.region,
      listingHostPhone: listings.hostPhone,
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(bookings.checkIn));

  return Response.json({
    bookings: rows.map((r) => ({
      ...r,
      ref: bookingRef(r.id),
      status: displayStatus(r),
    })),
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  const guestName = String(body.guestName ?? "").trim();
  const guestEmail = String(body.guestEmail ?? "").trim();
  const guestPhone = String(body.guestPhone ?? "").trim();
  const guestVerified = Boolean(body.guestVerified);
  const checkIn = String(body.checkIn ?? "");
  const checkOut = String(body.checkOut ?? "");
  const guests = Number(body.guests);
  const nights = Number(body.nights);
  const totalKes = Number(body.totalKes);
  const paymentMethod = String(body.paymentMethod ?? "property");
  const transferRequested = Boolean(body.transferRequested);
  const transferFee = Number(body.transferFee ?? 0);

  if (
    !Number.isInteger(listingId) ||
    listingId <= 0 ||
    guestName.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(guestEmail) ||
    !checkIn ||
    !checkOut ||
    !Number.isInteger(guests) ||
    guests <= 0 ||
    !Number.isInteger(nights) ||
    nights <= 0
  ) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 422 });
  }

  if (paymentMethod !== "mpesa" && paymentMethod !== "property") {
    return Response.json({ error: "Invalid payment method" }, { status: 422 });
  }
  // Phone is always required now: it verifies the guest and powers M-Pesa refunds.
  if (!validKenyanPhone(guestPhone)) {
    return Response.json(
      { error: "Enter a valid Kenyan phone number (e.g. 07XXXXXXXX)" },
      { status: 422 },
    );
  }

  // Reject if the requested stay overlaps any existing booking (real availability).
  // Cancelled bookings no longer block dates.
  const clashes = await db
    .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId),
        ne(bookings.status, "cancelled"),
        lt(bookings.checkIn, checkOut),
        gt(bookings.checkOut, checkIn),
      ),
    )
    .limit(1);
  if (clashes.length > 0) {
    return Response.json({ error: "Those dates are already booked" }, { status: 409 });
  }

  const listing = await db.select({ id: listings.id }).from(listings).where(eq(listings.id, listingId)).limit(1);
  if (listing.length === 0) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const [row] = await db
    .insert(bookings)
    .values({
      listingId,
      guestName,
      guestEmail,
      guestPhone: guestPhone || null,
      guestVerified,
      checkIn,
      checkOut,
      guests,
      nights,
      totalKes: Number.isFinite(totalKes) ? Math.round(totalKes) : 0,
      paymentMethod,
      // M-Pesa bookings wait for the STK push PIN; pay-at-property confirms instantly.
      status: paymentMethod === "mpesa" ? "pending" : "confirmed",
      transferRequested,
      transferFee: Number.isFinite(transferFee) ? Math.round(transferFee) : 0,
    })
    .returning({ id: bookings.id });

  return Response.json(
    { ok: true, id: row.id, status: paymentMethod === "mpesa" ? "pending" : "confirmed" },
    { status: 201 },
  );
}
