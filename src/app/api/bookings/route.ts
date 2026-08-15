import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings, listings } from "@/db/schema";
import { and, eq, gt, lt } from "drizzle-orm";

export const dynamic = "force-dynamic";

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
  const checkIn = String(body.checkIn ?? "");
  const checkOut = String(body.checkOut ?? "");
  const guests = Number(body.guests);
  const nights = Number(body.nights);
  const totalKes = Number(body.totalKes);

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

  // Reject if the requested stay overlaps any existing booking (real availability).
  const clashes = await db
    .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId),
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
      checkIn,
      checkOut,
      guests,
      nights,
      totalKes: Number.isFinite(totalKes) ? Math.round(totalKes) : 0,
    })
    .returning({ id: bookings.id });

  return Response.json({ ok: true, id: row.id }, { status: 201 });
}
