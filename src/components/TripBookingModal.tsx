"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useT, type TKey, type TVars } from "./Localized";
import { CloseIcon } from "./icons";
import { stayPricing } from "@/lib/seasons";
import { SERVICE_FEE_RATE } from "@/lib/constants";
import { formatKes } from "@/lib/format";
import type { PublicListing } from "@/lib/data";

type TripRow = { id: number; day: number; nights: number; listing: PublicListing };
type TFunc = (key: TKey, vars?: TVars) => string;

type Step = "form" | "submitting" | "stk" | "success";

type CreatedBooking = { id: number; ref: string; status: string; listingTitle: string; day: number };
type TripResult = {
  ok: boolean;
  itineraryRef: string;
  totalKes: number;
  count: number;
  status: string;
  bookings: CreatedBooking[];
};

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const validPhone = (p: string) => /^(\+254|0)7\d{8}$/.test(p.replace(/[\s-]/g, ""));

function formatDay(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function TripBookingModal({
  rows,
  tripName,
  onClose,
}: {
  rows: TripRow[];
  tripName: string;
  onClose: () => void;
}) {
  const t = useT();
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(addDays(today, 3));
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"property" | "mpesa">("property");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [result, setResult] = useState<TripResult | null>(null);
  // M-Pesa STK state (mirrors the single-booking widget).
  const [stkSent, setStkSent] = useState(false);
  const [stkLive, setStkLive] = useState(false);
  const [stkError, setStkError] = useState("");
  const [confirming, setConfirming] = useState(false);

  // Derived per-stay dates + display pricing (server recomputes on create).
  const legs = useMemo(
    () =>
      rows.map((r) => {
        const checkIn = addDays(startDate, r.day - 1);
        const checkOut = addDays(checkIn, r.nights);
        const pricing = stayPricing(
          {
            pricePerNight: r.listing.pricePerNight,
            peakPricePerNight: r.listing.peakPricePerNight,
            monthlyDiscountPct: r.listing.monthlyDiscountPct,
            groupDiscountPct: r.listing.groupDiscountPct,
          },
          checkIn,
          checkOut,
          guests,
        );
        const discounted = pricing.subtotal - pricing.discount;
        const serviceFee = Math.round(discounted * SERVICE_FEE_RATE);
        return {
          row: r,
          checkIn,
          checkOut,
          totalKes: discounted + r.listing.cleaningFee + serviceFee,
        };
      }),
    [rows, startDate, guests],
  );
  const total = legs.reduce((s, l) => s + l.totalKes, 0);

  const formValid =
    startDate >= today &&
    name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email) &&
    validPhone(phone) &&
    verified;

  function sendCode() {
    if (!validPhone(phone)) {
      setCodeError(t("widget.phoneRequired"));
      return;
    }
    setCodeError("");
    setVerified(false);
    setCode("");
    setSentCode(String(Math.floor(1000 + Math.random() * 9000)));
  }

  function checkCode() {
    if (sentCode && sentCode === code.trim()) {
      setVerified(true);
      setCodeError("");
    } else {
      setVerified(false);
      setCodeError(t("widget.codeMismatch"));
    }
  }

  async function createTrip() {
    setStep("submitting");
    setError("");
    try {
      const res = await fetch("/api/trip-bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startDate,
          guests,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          guestVerified: verified,
          paymentMethod,
          tripName,
          items: rows.map((r) => ({ listingId: r.id, day: r.day, nights: r.nights })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as TripResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStep("form");
        return;
      }
      setResult(data);
      if (paymentMethod === "property") {
        setStep("success");
      } else {
        setStep("stk");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("form");
    }
  }

  // Kick off the STK push for the whole itinerary through the backend.
  useEffect(() => {
    if (step !== "stk" || stkSent || !result) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ itineraryRef: result.itineraryRef }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setStkError(data.error ?? "Could not start the M-Pesa payment.");
          return;
        }
        setStkSent(true);
        setStkLive(!data.simulated);
      } catch {
        if (!cancelled) setStkError("Could not reach the payment service. Please try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [step, stkSent, result]);

  // Live mode: poll the itinerary until the webhook confirms every booking.
  useEffect(() => {
    if (step !== "stk" || !stkSent || !stkLive || !result) return;
    let cancelled = false;
    let tries = 0;
    const iv = setInterval(async () => {
      tries += 1;
      try {
        const res = await fetch(`/api/bookings?ref=${result.itineraryRef}`);
        const data = await res.json().catch(() => ({}));
        const found = (data.bookings ?? []) as { status: string }[];
        if (found.length > 0 && found.every((b) => b.status !== "pending")) {
          clearInterval(iv);
          if (!cancelled) setStep("success");
        } else if (tries >= 36) {
          clearInterval(iv); // ~3 min — the guest can check My bookings.
        }
      } catch {
        // network hiccup — keep polling
      }
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [step, stkSent, stkLive, result]);

  async function simulateStk() {
    if (!result) return;
    setConfirming(true);
    try {
      const res = await fetch("/api/trip-bookings/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ itineraryRef: result.itineraryRef }),
      });
      if (res.ok) {
        setStep("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not confirm the payment.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4"
      onClick={() => step !== "submitting" && onClose()}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success */}
        {step === "success" && result && (
          <div className="text-center">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-3 text-xl font-bold text-ink">{t("trip.bookSuccessTitle")}</h3>
            <p className="mt-1 text-sm text-sand-700">
              {t("trip.bookSuccessBody", { ref: result.itineraryRef, n: result.count })}
            </p>
            <p className="mt-2 text-sm font-extrabold text-brand">
              {t("trip.bookTotal")}: {formatKes(result.totalKes)}
            </p>
            <Link
              href={`/bookings?ref=${result.itineraryRef}`}
              className="brand-bg mt-5 inline-block rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg"
            >
              {t("trip.bookView")}
            </Link>
            <button
              onClick={onClose}
              className="mt-3 block w-full text-sm font-semibold text-sand-700 underline hover:text-ink"
            >
              {t("widget.another")}
            </button>
          </div>
        )}

        {/* M-Pesa waiting */}
        {step === "stk" && result && (
          <div className="text-center">
            <div className="text-5xl">📲</div>
            <h3 className="mt-3 text-lg font-bold text-ink">{t("trip.bookPending")}</h3>
            {stkError && <p className="mt-2 text-sm font-semibold text-brand">{stkError}</p>}
            {!stkSent ? (
              <p className="mt-2 text-xs text-sand-600">{t("widget.stkChecking")}</p>
            ) : stkLive ? (
              <>
                <p className="mt-2 text-sm text-ink/80">
                  {t("trip.bookStk", { phone, total: formatKes(result.totalKes) })}
                </p>
                <p className="mt-1 text-xs text-sand-600">{t("widget.stkChecking")}</p>
                <span className="mx-auto mt-3 block h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-ink/80">
                  {t("trip.bookStk", { phone, total: formatKes(result.totalKes) })}
                </p>
                <button
                  onClick={simulateStk}
                  disabled={confirming}
                  className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {confirming ? "…" : t("trip.bookPin")}
                </button>
                <p className="mt-2 text-[11px] text-sand-600">{t("trip.bookPinNote")}</p>
              </>
            )}
          </div>
        )}

        {/* Booking form */}
        {step !== "success" && step !== "stk" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{t("trip.book")}</h3>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand-100"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-sand-700">{t("trip.bookSub")}</p>

            {/* Start date + guests */}
            <div className="grid grid-cols-2 gap-3">
              <label className="rounded-xl border border-sand-300 p-3">
                <span className="text-[11px] font-bold uppercase tracking-wide">{t("trip.bookStart")}</span>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full bg-transparent text-sm outline-none"
                />
              </label>
              <label className="rounded-xl border border-sand-300 p-3">
                <span className="text-[11px] font-bold uppercase tracking-wide">{t("search.guests")}</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 block w-full bg-transparent text-sm outline-none"
                >
                  {Array.from({ length: 16 }).map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {t("widget.guest")}
                      {i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-1 text-[11px] text-sand-600">{t("trip.bookStartSub")}</p>

            {/* Itinerary breakdown */}
            <div className="mt-4 rounded-xl border border-sand-200 bg-sand-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-sand-600">
                {t("trip.bookBreakdown")}
              </p>
              <ul className="mt-2 space-y-2">
                {legs.map((l) => (
                  <li key={l.row.id + "-" + l.row.day} className="flex items-start justify-between gap-2 text-sm">
                    <span className="min-w-0">
                      <span className="font-bold text-ink">{l.row.listing.title}</span>
                      <span className="block text-xs text-sand-600">
                        {t("trip.bookDate", {
                          day: l.row.day,
                          in: formatDay(l.checkIn),
                          out: formatDay(l.checkOut),
                        })}
                      </span>
                    </span>
                    <span className="shrink-0 font-bold text-ink">{formatKes(l.totalKes)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-sand-200 pt-2 font-bold text-ink">
                <span>{t("trip.bookTotal")}</span>
                <span className="text-brand">{formatKes(total)}</span>
              </p>
            </div>

            {/* Payment choice */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("property")}
                className={`rounded-xl border-2 p-3 text-left transition ${
                  paymentMethod === "property" ? "border-brand bg-ember-50" : "border-sand-300 hover:border-brand/50"
                }`}
              >
                <span className="block text-lg">🏡</span>
                <span className="mt-1 block text-sm font-bold">{t("widget.payAtProperty")}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-sand-600">
                  {t("widget.payAtPropertySub")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("mpesa")}
                className={`rounded-xl border-2 p-3 text-left transition ${
                  paymentMethod === "mpesa" ? "border-emerald-500 bg-emerald-50" : "border-sand-300 hover:border-emerald-400/50"
                }`}
              >
                <span className="block text-lg">📲</span>
                <span className="mt-1 block text-sm font-bold text-emerald-700">{t("widget.mpesa")}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-sand-600">{t("widget.mpesaSub")}</span>
              </button>
            </div>

            {/* Guest verification */}
            <div className="mt-3 rounded-xl bg-gold-50 p-3">
              <div className="flex gap-2">
                <input
                  placeholder="+254 7XX XXX XXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setVerified(false);
                  }}
                  className="w-full rounded-xl border border-gold-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={!validPhone(phone)}
                  className="shrink-0 rounded-xl border border-gold-400 bg-white px-3 py-2 text-xs font-bold text-ink transition hover:bg-gold-100 disabled:opacity-40"
                >
                  {t("widget.sendCode")}
                </button>
              </div>
              {sentCode && !verified && (
                <div className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-xs">
                  <p className="font-semibold text-ink">{t("widget.demoCode", { code: sentCode })}</p>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      placeholder={t("widget.enterCode")}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && checkCode()}
                      maxLength={4}
                      className="w-32 rounded-lg border border-gold-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
                    />
                    <button
                      type="button"
                      onClick={checkCode}
                      className="rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                    >
                      OK
                    </button>
                  </div>
                  {codeError && <p className="mt-1.5 text-xs font-semibold text-brand">{codeError}</p>}
                </div>
              )}
              {verified && <p className="mt-1.5 text-[11px] font-semibold text-emerald-700">{t("widget.verifiedBadge")}</p>}
              <p className="mt-1.5 text-[11px] text-sand-600">📲 {t("widget.verifyHint")}</p>
              <p className="mt-1 text-[11px] text-sand-600">✅ {t("widget.phoneNote")}</p>
            </div>

            <input
              placeholder={t("widget.fullName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <input
              type="email"
              placeholder={t("widget.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            {error && <p className="mt-2 text-sm text-brand">{error}</p>}
            <button
              disabled={!formValid || step === "submitting"}
              onClick={createTrip}
              className={`mt-4 w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50 ${
                paymentMethod === "mpesa" ? "bg-emerald-600 hover:bg-emerald-700" : "brand-bg"
              }`}
            >
              {step === "submitting" ? t("widget.submitting") : t("trip.book")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
