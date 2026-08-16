import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Demo-mode "I've entered my PIN" for a whole trip: confirms every pending
 * M-Pesa booking under the itinerary at once. With live IntaSend keys the
 * webhook (POST /api/payments/webhook) does this automatically instead.
 */
export async function POST(req: NextRequest) {
  let body: { itineraryRef?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const itineraryRef = String(body.itineraryRef ?? "").trim().toUpperCase();
  if (!/^SS-ITN-[A-Z0-9]{6}$/.test(itineraryRef)) {
    return Response.json({ error: "Invalid itinerary ref" }, { status: 400 });
  }

  const rows = await db
    .update(bookings)
    .set({ status: "confirmed" })
    .where(and(eq(bookings.itineraryRef, itineraryRef), eq(bookings.status, "pending")))
    .returning({ id: bookings.id });

  if (rows.length === 0) {
    return Response.json(
      { error: "No pending bookings found for this trip" },
      { status: 404 },
    );
  }

  return Response.json({ ok: true, confirmed: rows.length });
}
