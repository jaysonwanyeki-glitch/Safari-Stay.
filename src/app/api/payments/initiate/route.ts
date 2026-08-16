import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings, listings } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { initiateStkPush } from "@/lib/payments";
import { bookingRef } from "@/lib/format";

export const dynamic = "force-dynamic";

const ITN_RE = /^SS-ITN-[A-Z0-9]{6}$/i;

/**
 * Start the M-Pesa STK push for a pending booking — or for a whole trip
 * itinerary (all its bookings in one push). The guest's phone receives the
 * payment prompt; the webhook route confirms on completion. With no IntaSend
 * credentials configured this returns a simulated success so the demo flow
 * keeps working.
 */
export async function POST(req: NextRequest) {
  let body: { bookingId?: number; itineraryRef?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const bookingId = Number(body.bookingId);
  const itineraryRef = String(body.itineraryRef ?? "").trim().toUpperCase();

  if (!(Number.isInteger(bookingId) && bookingId > 0) && !ITN_RE.test(itineraryRef)) {
    return Response.json({ error: "Provide a valid booking id or itinerary ref" }, { status: 400 });
  }

  // ---- Whole-trip itinerary: one STK push for the combined total ----
  if (ITN_RE.test(itineraryRef)) {
    const rows = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        paymentMethod: bookings.paymentMethod,
        guestPhone: bookings.guestPhone,
        guestEmail: bookings.guestEmail,
        totalKes: bookings.totalKes,
        tripName: bookings.tripName,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.itineraryRef, itineraryRef),
          eq(bookings.status, "pending"),
          eq(bookings.paymentMethod, "mpesa"),
        ),
      );

    if (rows.length === 0) {
      return Response.json(
        { error: "No pending M-Pesa bookings found for this trip" },
        { status: 404 },
      );
    }
    const phone = rows[0].guestPhone;
    if (!phone) {
      return Response.json({ error: "Trip has no guest phone number" }, { status: 422 });
    }
    const totalKes = rows.reduce((s, r) => s + r.totalKes, 0);
    const tripName = rows[0].tripName?.trim();
    const narrative = tripName
      ? `${tripName} · ${rows.length} stays · ${itineraryRef}`
      : `${rows.length} stays · ${itineraryRef}`;

    const result = await initiateStkPush({
      apiRef: itineraryRef,
      phone,
      amountKes: totalKes,
      email: rows[0].guestEmail ?? undefined,
      narrative,
    });

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 502 });
    }

    return Response.json({
      ok: true,
      simulated: result.simulated,
      invoiceId: result.invoiceId,
      state: result.simulated ? "PENDING" : result.state,
      count: rows.length,
      totalKes,
    });
  }

  // ---- Single booking (existing flow) ----
  const rows = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      paymentMethod: bookings.paymentMethod,
      guestPhone: bookings.guestPhone,
      guestEmail: bookings.guestEmail,
      totalKes: bookings.totalKes,
      listingTitle: listings.title,
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (rows.length === 0) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }
  const b = rows[0];

  if (b.status !== "pending") {
    return Response.json({ error: "Only pending M-Pesa bookings can be paid" }, { status: 409 });
  }
  if (b.paymentMethod !== "mpesa") {
    return Response.json({ error: "This booking is pay-at-property" }, { status: 409 });
  }
  if (!b.guestPhone) {
    return Response.json({ error: "Booking has no guest phone number" }, { status: 422 });
  }

  const result = await initiateStkPush({
    apiRef: `SS-${b.id}`,
    phone: b.guestPhone,
    amountKes: b.totalKes,
    email: b.guestEmail ?? undefined,
    narrative: `${b.listingTitle} · ${bookingRef(b.id)}`,
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    simulated: result.simulated,
    invoiceId: result.invoiceId,
    state: result.simulated ? "PENDING" : result.state,
  });
}
