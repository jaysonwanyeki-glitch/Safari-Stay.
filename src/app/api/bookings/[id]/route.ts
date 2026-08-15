import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Free cancellation window: at least 48 hours before check-in. */
const CANCEL_HOURS = 48;

function insideCancellationWindow(checkIn: string): boolean {
  const deadline = new Date();
  deadline.setTime(deadline.getTime() + CANCEL_HOURS * 3600 * 1000);
  // ISO dates compare lexicographically; a check-in past the deadline can't be cancelled free.
  return checkIn > deadline.toISOString().slice(0, 10);
}

/**
 * Booking lifecycle actions (demo of the real Kenyan flow):
 * - "confirm" — simulate the M-Pesa STK push PIN entry → pending → confirmed
 * - "cancel"   — free cancellation within the 48-hour window; the refund would
 *                return to the guest's M-Pesa and the dates free up again.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return Response.json({ error: "Invalid booking id" }, { status: 400 });
  }

  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const existing = await db
    .select({ id: bookings.id, status: bookings.status, checkIn: bookings.checkIn })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  if (existing.length === 0) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }
  const current = existing[0].status;

  if (body.action === "confirm") {
    if (current !== "pending") {
      return Response.json({ error: "Only pending M-Pesa bookings can be confirmed" }, { status: 409 });
    }
    await db.update(bookings).set({ status: "confirmed" }).where(eq(bookings.id, bookingId));
    return Response.json({ ok: true, status: "confirmed" });
  }

  if (body.action === "cancel") {
    if (current === "cancelled" || current === "completed") {
      return Response.json({ error: "This booking can no longer be cancelled" }, { status: 409 });
    }
    if (!insideCancellationWindow(existing[0].checkIn)) {
      return Response.json(
        { error: "Free cancellation ended — check-in is within 48 hours." },
        { status: 409 },
      );
    }
    await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, bookingId));
    return Response.json({ ok: true, status: "cancelled" });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
