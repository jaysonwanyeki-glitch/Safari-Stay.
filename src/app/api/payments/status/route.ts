import { paymentsLive } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Tells the UI whether real M-Pesa payments are configured or the demo is on. */
export async function GET() {
  return Response.json({
    live: paymentsLive(),
    provider: "IntaSend",
    testMode: process.env.INTASEND_TEST_MODE === "true",
  });
}
