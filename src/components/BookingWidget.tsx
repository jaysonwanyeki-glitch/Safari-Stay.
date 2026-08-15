"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PublicListing } from "@/lib/data";
import { SERVICE_FEE_RATE, waLink } from "@/lib/constants";
import { bookingRef, formatKes } from "@/lib/format";
import { SEASON_BLURB, SEASON_EMOJI, stayPricing } from "@/lib/seasons";
import { formatUsd } from "@/lib/currency";
import { PICK_CHECKIN_EVENT, type PickCheckinDetail } from "@/lib/events";
import { CloseIcon, StarIcon } from "./icons";
import { useT } from "./Localized";

type Status = "idle" | "confirm" | "submitting" | "success" | "error";

type Availability = {
  booked: { checkIn: string; checkOut: string }[];
  season: { key: "peak" | "shoulder" | "green"; label: string; emoji: string };
  stats: { bookedThisWeek: number; bookedThisMonth: number };
  usdPerKes: number;
};

type Booking = {
  id: number;
  nights: number;
  total: number;
  status: "pending" | "confirmed";
  paymentMethod: "mpesa" | "property";
  phone: string;
};

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const d1 = new Date(a + "T00:00:00").getTime();
  const d2 = new Date(b + "T00:00:00").getTime();
  if (isNaN(d1) || isNaN(d2) || d2 <= d1) return 0;
  return Math.round((d2 - d1) / 86400000);
}

/** ISO dates compare lexicographically; treat checkout as exclusive. */
function overlaps(aIn: string, aOut: string, bIn: string, bOut: string) {
  return aIn < bOut && bIn < aOut;
}

function addDays(isoDate: string, days: number) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const validPhone = (p: string) => /^(\+254|0)7\d{8}$/.test(p.replace(/[\s-]/g, ""));

export default function BookingWidget({ listing }: { listing: PublicListing }) {
  const t = useT();
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"property" | "mpesa">("property");
  const [transfer, setTransfer] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [avail, setAvail] = useState<Availability | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/availability?listingId=${listing.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Availability | null) => {
        if (active && data) setAvail(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [listing.id]);

  // A day tapped in the availability strip becomes the check-in date.
  useEffect(() => {
    function onPick(e: Event) {
      const detail = (e as CustomEvent<PickCheckinDetail>).detail;
      if (!detail?.date || detail.listingId !== listing.id) return;
      setCheckIn(detail.date);
      setCheckOut((out) => (out && out <= detail.date ? "" : out));
      const el = document.getElementById("booking-widget");
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
    window.addEventListener(PICK_CHECKIN_EVENT, onPick);
    return () => window.removeEventListener(PICK_CHECKIN_EVENT, onPick);
  }, [listing.id]);

  const nights = nightsBetween(checkIn, checkOut);

  // Kenya-style pricing: seasonal nightly rates + negotiated monthly/group discounts.
  const pricing = stayPricing(
    {
      pricePerNight: listing.pricePerNight,
      peakPricePerNight: listing.peakPricePerNight,
      monthlyDiscountPct: listing.monthlyDiscountPct,
      groupDiscountPct: listing.groupDiscountPct,
    },
    checkIn,
    checkOut,
    guests,
  );
  const discounted = pricing.subtotal - pricing.discount;
  const cleaning = listing.cleaningFee;
  const service = Math.round(discounted * SERVICE_FEE_RATE);
  const transferFee = transfer ? listing.airportTransferKes : 0;
  const total = discounted + cleaning + service + transferFee;

  const clash = avail
    ? avail.booked.find((b) => overlaps(checkIn, checkOut, b.checkIn, b.checkOut))
    : undefined;
  const datesValid = nights > 0 && !clash && checkOut > checkIn;
  const formValid =
    name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email) &&
    (paymentMethod === "property" || validPhone(phone));

  const usdTotal = avail && avail.usdPerKes > 0 ? formatUsd(total / avail.usdPerKes) : null;
  const wa = waLink(listing);

  function suggestNext() {
    if (!avail || avail.booked.length === 0) return;
    const sorted = [...avail.booked].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    let candidate = today;
    for (const b of sorted) {
      if (overlaps(candidate, addDays(candidate, 3), b.checkIn, b.checkOut)) {
        candidate = b.checkOut;
      }
    }
    return addDays(candidate, 1);
  }
  const suggestion = clash ? suggestNext() : null;

  async function confirm() {
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          paymentMethod,
          transferRequested: transfer,
          transferFee,
          checkIn,
          checkOut,
          guests,
          nights,
          totalKes: total,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError("Those dates were just booked. Please choose other dates.");
        setStatus("confirm");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("confirm");
        return;
      }
      setBooking({
        id: data.id,
        nights,
        total,
        status: data.status ?? "confirmed",
        paymentMethod,
        phone,
      });
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("confirm");
    }
  }

  /** Demo of the M-Pesa STK push: guest enters PIN → booking confirms. */
  async function simulateStk() {
    if (!booking) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "confirm" }),
      });
      if (res.ok) {
        setBooking({ ...booking, status: "confirmed" });
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

  const nightly = useMemo(() => listing.pricePerNight, [listing.pricePerNight]);

  if (status === "success" && booking) {
    const pending = booking.status === "pending";
    return (
      <div
        className={`rounded-2xl border p-6 text-center ${
          pending ? "border-gold-300 bg-gold-50" : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="text-4xl">{pending ? "📲" : "🎉"}</div>
        <h3 className="mt-2 text-lg font-bold text-ink">
          {pending ? t("widget.pendingTitle") : t("widget.successTitle")}
        </h3>
        <p className="mt-1 text-sm text-ink/80">
          {t("widget.successBody", { ref: bookingRef(booking.id) })}
        </p>
        <p className="mt-2 text-sm text-ink/80">
          {t("widget.successDetail", {
            n: booking.nights,
            total: formatKes(booking.total),
          })}
        </p>
        {transfer && listing.airportTransferKes > 0 && (
          <p className="mt-1 text-xs font-semibold text-ink/70">
            {t("widget.transferAdded")} · {formatKes(listing.airportTransferKes)}
          </p>
        )}

        {pending && (
          <>
            <p className="mt-2 text-sm text-ink/80">
              {t("widget.pendingBody", { phone: booking.phone })}
            </p>
            <button
              onClick={simulateStk}
              disabled={confirming}
              className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {confirming ? "…" : t("widget.pendingSimulate")}
            </button>
            <p className="mt-2 text-[11px] text-ink/60">🔒 Demo — no real STK push is sent.</p>
          </>
        )}

        {!pending && (
          <>
            <p className="mt-2 text-xs text-ink/70">
              {t("widget.successNote", {
                email: email || bookingRef(booking.id),
                host: listing.hostName,
              })}
            </p>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow transition hover:brightness-95"
              >
                💬 {t("widget.contactHost")}
              </a>
            )}
            <Link
              href={`/bookings?ref=${bookingRef(booking.id)}`}
              className="mt-3 block text-sm font-semibold text-brand underline hover:text-brand-dark"
            >
              {t("widget.viewBooking")}
            </Link>
          </>
        )}

        <button
          onClick={() => {
            setStatus("idle");
            setBooking(null);
            setCheckIn("");
            setCheckOut("");
            setName("");
            setEmail("");
            setPhone("");
            setTransfer(false);
          }}
          className="mt-4 rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-emerald-100"
        >
          {t("widget.another")}
        </button>
      </div>
    );
  }

  return (
    <div id="booking-widget" className="rounded-2xl border border-sand-200 bg-white p-6 shadow-xl shadow-sand-300/30">
      <div className="mb-3 flex items-baseline justify-between">
        <p>
          <span className="text-2xl font-bold">{formatKes(nightly)}</span>
          <span className="text-sand-700"> {t("widget.night")}</span>
        </p>
        <span className="flex items-center gap-1 text-sm">
          <StarIcon className="h-4 w-4" />
          {listing.rating.toFixed(2)} · {listing.reviewsCount} {t("widget.reviews")}
        </span>
      </div>

      {/* Live season + stats */}
      {avail && (
        <div className="mb-4 space-y-1.5 rounded-xl bg-sand-50 p-3 text-xs">
          <p className="flex items-center gap-1.5 font-semibold text-ink">
            <span>{SEASON_EMOJI[avail.season.key]}</span>
            {avail.season.label} {t("widget.seasonNow")}
          </p>
          <p className="text-sand-700">{SEASON_BLURB[avail.season.key]}</p>
          {avail.stats.bookedThisWeek > 0 && (
            <p className="font-semibold text-brand">{t("widget.bookedWeek", { n: avail.stats.bookedThisWeek })}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-sand-400">
        <label className="border-b border-r border-sand-400 p-3">
          <span className="text-[11px] font-bold uppercase tracking-wide">{t("search.checkIn")}</span>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && checkOut <= e.target.value) setCheckOut("");
            }}
            className="block w-full bg-transparent text-sm outline-none"
          />
        </label>
        <label className="border-b border-sand-400 p-3">
          <span className="text-[11px] font-bold uppercase tracking-wide">{t("search.checkOut")}</span>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="block w-full bg-transparent text-sm outline-none"
          />
        </label>
        <label className="col-span-2 border-b border-sand-400 p-3">
          <span className="text-[11px] font-bold uppercase tracking-wide">{t("search.guests")}</span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="block w-full bg-transparent text-sm outline-none"
          >
            {Array.from({ length: listing.maxGuests }).map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {t("widget.guest")}
                {i > 0 ? "s" : ""}
                {i + 1 === listing.maxGuests ? ` ${t("widget.max")}` : ""}
              </option>
            ))}
          </select>
        </label>
        {listing.airportTransferKes > 0 && (
          <label className="col-span-2 flex cursor-pointer items-center justify-between gap-3 p-3">
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-wide">
                {t("widget.transfer")}
              </span>
              <span className="block text-xs text-sand-600">
                {t("widget.transferSub")} · {formatKes(listing.airportTransferKes)}
              </span>
            </span>
            <input
              type="checkbox"
              checked={transfer}
              onChange={(e) => setTransfer(e.target.checked)}
              className="h-5 w-5 accent-[#E07A3F]"
            />
          </label>
        )}
      </div>

      <p className="mt-2 text-xs text-sand-700">
        Check-in from <span className="font-semibold text-ink">{listing.checkInTime}</span> · Check-out by{" "}
        <span className="font-semibold text-ink">{listing.checkOutTime}</span>
      </p>

      {clash && (
        <p className="mt-3 rounded-lg bg-ember-50 px-3 py-2 text-sm font-semibold text-brand">
          {t("widget.clash")}
          {suggestion && (
            <button
              onClick={() => {
                setCheckIn(suggestion);
                setCheckOut(addDays(suggestion, nights || 3));
              }}
              className="ml-1 underline"
            >
              {t("widget.try")}{" "}
              {new Date(suggestion + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </button>
          )}
        </p>
      )}

      {datesValid && !clash && (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-sand-700">
              {t("widget.avgNight", {
                price: formatKes(pricing.subtotal / pricing.nights),
                n: pricing.nights,
              })}
            </dt>
            <dd>{formatKes(pricing.subtotal)}</dd>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between font-semibold text-emerald-700">
              <dt>{pricing.discountLabel}</dt>
              <dd>−{formatKes(pricing.discount)}</dd>
            </div>
          )}
          {cleaning > 0 && (
            <div className="flex justify-between">
              <dt className="text-sand-700">{t("widget.cleaningFee")}</dt>
              <dd>{formatKes(cleaning)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-sand-700">{t("widget.serviceFee")}</dt>
            <dd>{formatKes(service)}</dd>
          </div>
          {transfer && transferFee > 0 && (
            <div className="flex justify-between">
              <dt className="text-sand-700">🚗 {t("widget.transfer")}</dt>
              <dd>{formatKes(transferFee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-sand-200 pt-2 font-bold">
            <dt>
              {t("widget.total")}
              {usdTotal ? <span className="ml-2 font-normal text-sand-700">≈ {usdTotal}</span> : null}
            </dt>
            <dd>{formatKes(total)}</dd>
          </div>
        </dl>
      )}

      <button
        disabled={!datesValid}
        onClick={() => setStatus("confirm")}
        className="brand-bg mt-5 w-full rounded-xl py-3 text-base font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {clash ? t("widget.unavailable") : datesValid ? t("widget.reserve") : t("widget.selectDates")}
      </button>
      <p className="mt-2 text-center text-xs text-sand-600">
        {paymentMethod === "mpesa" ? t("widget.mpesaSub") : t("widget.noCharge")}
      </p>

      {(status === "confirm" || status === "submitting") && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={() => status !== "submitting" && setStatus("idle")}>
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">{t("widget.confirmTitle")}</h3>
              <button onClick={() => setStatus("idle")} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand-100">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-sm text-sand-700">
              {nights} {t("widget.night")}
              {nights > 1 ? "s" : ""} at {listing.title} · {formatKes(total)}
              {usdTotal ? ` (≈ ${usdTotal})` : ""}
            </p>

            {/* How do you want to pay? — the real Kenyan choice */}
            <div className="mb-3 grid grid-cols-2 gap-2">
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

            {paymentMethod === "mpesa" && (
              <div className="mb-3 rounded-xl bg-emerald-50 p-3">
                <input
                  placeholder="+254 7XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
                <p className="mt-1.5 text-[11px] text-emerald-800">✅ {t("widget.phoneNote")}</p>
              </div>
            )}

            <input
              placeholder={t("widget.fullName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <input
              type="email"
              placeholder={t("widget.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            {error && <p className="mb-2 text-sm text-brand">{error}</p>}
            <button
              disabled={!formValid || status === "submitting"}
              onClick={confirm}
              className={`w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50 ${
                paymentMethod === "mpesa" ? "bg-emerald-600 hover:bg-emerald-700" : "brand-bg"
              }`}
            >
              {status === "submitting" ? t("widget.submitting") : t("widget.confirmBtn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
