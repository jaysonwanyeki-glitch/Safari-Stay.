import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { verifyWebhookSignature } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * IntaSend webhook — fired when the M-Pesa STK push completes. We look the
 * payment up by the api_ref we sent and mark the booking(s) confirmed:
 * - `SS-<id>`          → a single booking
 * - `SS-ITN-<code>`    → a whole trip itinerary (all its pending bookings)
 * Respond fast (200) so IntaSend doesn't retry.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-intasend-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const invoice = payload.invoice as Record<string, unknown> | undefined;
  const apiRef = String(payload.api_ref ?? invoice?.api_ref ?? "").toUpperCase();
  const state = String(payload.state ?? invoice?.state ?? "").toUpperCase();

  if (state !== "COMPLETED" && state !== "SUCCESS") {
    return Response.json({ ok: true });
  }

  const itineraryMatch = /^SS-ITN-[A-Z0-9]{6}$/i.exec(apiRef);
  if (itineraryMatch) {
    // Whole trip: confirm every still-pending booking under this itinerary.
    await db
      .update(bookings)
      .set({ status: "confirmed" })
      .where(and(eq(bookings.itineraryRef, apiRef), eq(bookings.status, "pending")));
    return Response.json({ ok: true });
  }

  const singleMatch = /^SS-(\d+)$/i.exec(apiRef);
  if (singleMatch) {
    const bookingId = Number(singleMatch[1]);
    const rows = await db
      .select({ id: bookings.id, status: bookings.status })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
    if (rows.length > 0 && rows[0].status === "pending") {
      await db.update(bookings).set({ status: "confirmed" }).where(eq(bookings.id, bookingId));
    }
  }

  return Response.json({ ok: true });
}
