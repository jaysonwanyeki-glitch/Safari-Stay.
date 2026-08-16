import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings, listings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { initiateStkPush } from "@/lib/payments";
import { bookingRef } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Start the M-Pesa STK push for a pending booking. The guest's phone receives
 * the payment prompt; the webhook route confirms the booking on completion.
 * With no IntaSend credentials configured this returns a simulated success so
 * the demo flow keeps working.
 */
export async function POST(req: NextRequest) {
  let body: { bookingId?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const bookingId = Number(body.bookingId);
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return Response.json({ error: "Invalid booking id" }, { status: 400 });
  }

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
    bookingId: b.id,
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
