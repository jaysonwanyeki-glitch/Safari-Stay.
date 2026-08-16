import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyWebhookSignature } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * IntaSend webhook — fired when the M-Pesa STK push completes. We look the
 * booking up by the `SS-<id>` api_ref we sent and mark it confirmed on success.
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
  const apiRef = String(payload.api_ref ?? invoice?.api_ref ?? "");
  const state = String(payload.state ?? invoice?.state ?? "").toUpperCase();
  const match = /^SS-(\d+)$/i.exec(apiRef);

  if (match && (state === "COMPLETED" || state === "SUCCESS")) {
    const bookingId = Number(match[1]);
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
