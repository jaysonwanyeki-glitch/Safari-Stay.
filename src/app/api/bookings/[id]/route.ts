import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Booking lifecycle actions (demo of the real Kenyan flow):
 * - "confirm" — simulate the M-Pesa STK push PIN entry → pending → confirmed
 * - "cancel"   — free cancellation (≤48h story); refund would return to the
 *                guest's M-Pesa, and the dates free up again.
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
    .select({ id: bookings.id, status: bookings.status })
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
    await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, bookingId));
    return Response.json({ ok: true, status: "cancelled" });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
