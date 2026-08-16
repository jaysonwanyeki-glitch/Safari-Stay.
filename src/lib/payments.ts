// ---------------------------------------------------------------- Payments
// M-Pesa STK push via IntaSend (https://developers.intasend.com) — the Kenya-first
// aggregator that pushes the payment prompt straight to the guest's phone.
//
// Live mode is switched on purely by environment variables; with none set the
// site stays in the demo flow (simulated STK push, no money moves). That way the
// whole app works locally and in preview, and "going live" is just adding keys.
//
//   INTASEND_TOKEN               — secret API token (Bearer auth)
//   INTASEND_PUBLISHABLE_KEY     — publishable key
//   INTASEND_TEST_MODE="true"    — use the sandbox environment (recommended first)
//
// Webhook: point IntaSend's webhook at POST /api/payments/webhook — it confirms
// the booking when the STK push completes.

import { createHmac, timingSafeEqual } from "node:crypto";

const INTASEND_BASE = process.env.INTASEND_TEST_MODE === "true" ? "https://sandbox.intasend.com" : "https://payment.intasend.com";

/** True when real M-Pesa credentials are configured. */
export function paymentsLive(): boolean {
  return Boolean(process.env.INTASEND_TOKEN && process.env.INTASEND_PUBLISHABLE_KEY);
}

/** "07XXXXXXXX" / "+2547XXXXXXXX" → "2547XXXXXXXX" (IntaSend wants 254 + 9 digits). */
export function normalizeMpesaPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

export type StkPushResult =
  | { ok: true; simulated: true; invoiceId: string }
  | { ok: true; simulated: false; invoiceId: string; state: string }
  | { ok: false; error: string };

/**
 * Trigger an M-Pesa STK push for a booking. In demo mode (no credentials) it
 * returns a simulated success so the flow can be exercised end-to-end.
 */
export async function initiateStkPush(opts: {
  bookingId: number;
  phone: string;
  amountKes: number;
  email?: string;
  narrative: string;
}): Promise<StkPushResult> {
  const token = process.env.INTASEND_TOKEN;
  const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY;
  const apiRef = `SS-${opts.bookingId}`;

  if (!token || !publishableKey) {
    return { ok: true, simulated: true, invoiceId: `DEMO-${opts.bookingId}` };
  }

  const body = {
    method: "M-PESA",
    currency: "KES",
    amount: Math.max(1, Math.round(opts.amountKes)),
    phone_number: normalizeMpesaPhone(opts.phone),
    email: opts.email ?? "",
    api_ref: apiRef,
    narrative: opts.narrative.slice(0, 100),
    host: process.env.NEXT_PUBLIC_SITE_URL ?? "https://safaristay.co.ke",
  };

  try {
    const res = await fetch(`${INTASEND_BASE}/api/v1/payment/mpesa-stk-push/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "INTASEND_PUBLIC_API_KEY": publishableKey,
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const msg =
        (data.detail as string) ??
        (data.message as string) ??
        (data.error as string) ??
        `IntaSend error ${res.status}`;
      return { ok: false, error: String(msg) };
    }
    const invoice = (data.invoice ?? data) as Record<string, unknown>;
    return {
      ok: true,
      simulated: false,
      invoiceId: String(invoice.invoice_id ?? data.invoice_id ?? ""),
      state: String(invoice.state ?? data.state ?? "PENDING").toUpperCase(),
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not reach the payment provider",
    };
  }
}

/**
 * Verify an IntaSend webhook signature (HMAC-SHA256 of the raw body with the
 * secret token). When no token is configured there is nothing to verify — the
 * demo never receives real webhooks, so accept (the booking confirm flow is
 * simulated client-side instead).
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const token = process.env.INTASEND_TOKEN;
  if (!token) return true;
  if (!signature) return false;
  const expected = createHmac("sha256", token).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
