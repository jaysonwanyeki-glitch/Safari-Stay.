"use client";

import { useMemo, useState } from "react";
import type { PublicListing } from "@/lib/data";
import { SERVICE_FEE_RATE } from "@/lib/constants";
import { formatKes } from "@/lib/format";
import { CloseIcon, StarIcon } from "./icons";

type Status = "idle" | "confirm" | "submitting" | "success" | "error";

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const d1 = new Date(a + "T00:00:00").getTime();
  const d2 = new Date(b + "T00:00:00").getTime();
  if (isNaN(d1) || isNaN(d2) || d2 <= d1) return 0;
  return Math.round((d2 - d1) / 86400000);
}

export default function BookingWidget({ listing }: { listing: PublicListing }) {
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [booking, setBooking] = useState<{ id: number; nights: number; total: number } | null>(null);
  const [error, setError] = useState("");

  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = listing.pricePerNight * nights;
  const cleaning = listing.cleaningFee;
  const service = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + cleaning + service;

  const datesValid = nights > 0;
  const formValid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email);

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
          checkIn,
          checkOut,
          guests,
          nights,
          totalKes: total,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setBooking({ id: data.id, nights, total });
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("confirm");
    }
  }

  const nightly = useMemo(() => listing.pricePerNight, [listing.pricePerNight]);

  if (status === "success" && booking) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="text-4xl">🎉</div>
        <h3 className="mt-2 text-lg font-bold text-emerald-900">Booking confirmed!</h3>
        <p className="mt-1 text-sm text-emerald-800">
          Karibu! Reference <span className="font-mono font-bold">SS-{String(booking.id).padStart(5, "0")}</span>
        </p>
        <p className="mt-2 text-sm text-emerald-800">
          {booking.nights} night{booking.nights > 1 ? "s" : ""} · {formatKes(booking.total)} total
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          A confirmation has been sent to {email}. Your host {listing.hostName} will be in touch.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setBooking(null);
            setCheckIn("");
            setCheckOut("");
            setName("");
            setEmail("");
          }}
          className="mt-4 rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-baseline justify-between">
        <p>
          <span className="text-2xl font-bold">{formatKes(nightly)}</span>
          <span className="text-slate-600"> night</span>
        </p>
        <span className="flex items-center gap-1 text-sm">
          <StarIcon className="h-4 w-4" />
          {listing.rating.toFixed(2)} · {listing.reviewsCount} reviews
        </span>
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-300">
        <label className="border-b border-r border-slate-300 p-3">
          <span className="text-[11px] font-bold uppercase tracking-wide">Check in</span>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="block w-full bg-transparent text-sm outline-none"
          />
        </label>
        <label className="border-b border-slate-300 p-3">
          <span className="text-[11px] font-bold uppercase tracking-wide">Check out</span>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="block w-full bg-transparent text-sm outline-none"
          />
        </label>
        <label className="col-span-2 p-3">
          <span className="text-[11px] font-bold uppercase tracking-wide">Guests</span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="block w-full bg-transparent text-sm outline-none"
          >
            {Array.from({ length: listing.maxGuests }).map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} guest{i > 0 ? "s" : ""}
                {i + 1 === listing.maxGuests ? " (max)" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {datesValid && (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">
              {formatKes(nightly)} × {nights} night{nights > 1 ? "s" : ""}
            </dt>
            <dd>{formatKes(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Cleaning fee</dt>
            <dd>{formatKes(cleaning)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">SafariStay service fee</dt>
            <dd>{formatKes(service)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
            <dt>Total</dt>
            <dd>{formatKes(total)}</dd>
          </div>
        </dl>
      )}

      <button
        disabled={!datesValid}
        onClick={() => setStatus("confirm")}
        className="brand-bg mt-5 w-full rounded-xl py-3 text-base font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {datesValid ? "Reserve" : "Select dates to reserve"}
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">You won&apos;t be charged yet</p>

      {(status === "confirm" || status === "submitting") && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={() => status !== "submitting" && setStatus("idle")}>
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">Confirm & reserve</h3>
              <button onClick={() => setStatus("idle")} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              {nights} night{nights > 1 ? "s" : ""} at {listing.title} · {formatKes(total)}
            </p>
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            {error && <p className="mb-2 text-sm text-brand">{error}</p>}
            <button
              disabled={!formValid || status === "submitting"}
              onClick={confirm}
              className="brand-bg w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {status === "submitting" ? "Reserving…" : "Confirm & pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
