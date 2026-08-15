"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { bookingRef, formatKes } from "@/lib/format";
import { SearchIcon } from "@/components/icons";
import { useT, type TKey } from "@/components/Localized";

type BookingResult = {
  id: number;
  ref: string;
  listingId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  paymentMethod: "mpesa" | "property";
  status: "upcoming" | "active" | "completed" | "pending" | "cancelled";
  transferRequested: boolean;
  transferFee: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalKes: number;
  createdAt: string;
  listingTitle: string;
  listingSlug: string;
  listingImage: string | null;
  listingLocation: string;
  listingRegion: string;
  listingHostPhone: string | null;
};

const STATUS_META: Record<BookingResult["status"], { labelKey: TKey; cls: string }> = {
  upcoming: { labelKey: "bookings.upcoming", cls: "bg-emerald-100 text-emerald-800" },
  active: { labelKey: "bookings.active", cls: "bg-gold-100 text-ink" },
  completed: { labelKey: "bookings.completed", cls: "bg-sand-200 text-sand-800" },
  pending: { labelKey: "bookings.pending", cls: "bg-amber-100 text-amber-800" },
  cancelled: { labelKey: "bookings.cancelled", cls: "bg-sand-100 text-sand-500 line-through" },
};

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildQuery(ref: string, email: string) {
  const p = new URLSearchParams();
  if (ref.trim()) p.set("ref", ref.trim());
  if (email.trim()) p.set("email", email.trim());
  return p.toString();
}

function waHref(phone: string, title: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Habari! I booked ${title} on SafariStay — just wanted to say hello!`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export default function BookingsPage() {
  const t = useT();
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<BookingResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const seqRef = useRef(0);

  async function search(refArg: string, emailArg: string) {
    const seq = ++seqRef.current; // ignore stale responses from earlier searches
    if (!refArg.trim() && !emailArg.trim()) {
      setError(t("bookings.enterHint"));
      setResults(null);
      setSearched(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings?${buildQuery(refArg, emailArg)}`);
      const data = await res.json();
      if (seq !== seqRef.current) return;
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setResults(null);
      } else {
        setResults(data.bookings);
      }
    } catch {
      if (seq !== seqRef.current) return;
      setError("Could not reach the server. Please try again.");
      setResults(null);
    } finally {
      if (seq === seqRef.current) {
        setLoading(false);
        setSearched(true);
      }
    }
  }

  /** Confirm an M-Pesa booking (demo STK PIN entry) or cancel one (free cancellation). */
  async function act(bookingId: number, action: "confirm" | "cancel") {
    setBusyId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Action failed");
      // Refresh the list so statuses re-render from the server.
      await search(ref, email);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  // Prefill from ?ref=SS-00001 or ?email=… (e.g. after confirming a booking).
  // State updates are deferred out of the effect body to avoid cascading renders.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const r = sp.get("ref") ?? "";
    const e = sp.get("email") ?? "";
    if (!r && !e) return;
    const timer = setTimeout(() => {
      setRef(r);
      setEmail(e);
      void search(r, e);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const noResults = searched && !loading && results?.length === 0;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{t("bookings.eyebrow")}</p>
      <h1 className="font-display mt-2 text-3xl font-bold sm:text-4xl">{t("bookings.title")}</h1>
      <p className="mt-2 max-w-xl text-sand-700">{t("bookings.sub")}</p>

      {/* Search card */}
      <div className="mt-8 rounded-2xl border border-sand-200 bg-white/90 p-6 shadow-xl shadow-sand-300/30">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-sand-700">
              {t("bookings.refLabel")}
            </span>
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(ref, email)}
              placeholder="e.g. SS-00012"
              className="w-full rounded-xl border border-sand-400 px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-sand-700">
              {t("bookings.emailLabel")}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(ref, email)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-sand-400 px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>
          <div className="flex items-end">
            <button
              onClick={() => search(ref, email)}
              disabled={loading}
              className="brand-bg flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              <SearchIcon className="h-4 w-4" />
              {loading ? t("bookings.searching") : t("bookings.find")}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-sand-600">
          {t("bookings.tip")} — {t("bookings.refLabel").toLowerCase()}s look like{" "}
          <span className="font-mono font-semibold">SS-{bookingRef(12)}</span>.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-brand/30 bg-ember-50 px-5 py-4 text-sm font-semibold text-brand">
          {error}
        </div>
      )}

      {noResults && (
        <div className="mt-6 grid place-items-center rounded-3xl border border-dashed border-sand-400 py-16 text-center">
          <div className="text-5xl">🧳</div>
          <h2 className="mt-3 text-xl font-bold">{t("bookings.noResultsTitle")}</h2>
          <p className="mt-1 max-w-sm text-sm text-sand-700">{t("bookings.noResultsBody")}</p>
          <Link
            href="/listings"
            className="brand-bg mt-5 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg"
          >
            {t("bookings.explore")}
          </Link>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              {results.length === 1 ? t("bookings.oneFound") : t("bookings.foundCount", { n: results.length })}
            </h2>
            <p className="text-xs text-sand-600">for {email || ref}</p>
          </div>
          <div className="space-y-4">
            {results.map((b) => {
              const meta = STATUS_META[b.status];
              const canCancel = b.status === "upcoming" || b.status === "pending";
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-sand-200 bg-white/90 p-4 shadow-sm transition hover:shadow-lg sm:flex-row"
                >
                  <Link
                    href={`/listings/${b.listingSlug}`}
                    className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.listingImage ?? ""}
                      alt={b.listingTitle}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sand-600">{b.ref}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.cls}`}>
                            {t(meta.labelKey)}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              b.paymentMethod === "mpesa"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-sand-100 text-sand-700"
                            }`}
                          >
                            {b.paymentMethod === "mpesa" ? "📲 " : "🏡 "}
                            {b.paymentMethod === "mpesa" ? t("bookings.mpesa") : t("bookings.payProperty")}
                          </span>
                          {b.guestPhone && b.status !== "cancelled" && (
                            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-ink">
                              ✅ {t("bookings.verified")} {b.guestPhone}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/listings/${b.listingSlug}`}
                          className="mt-1 block truncate text-lg font-bold text-ink hover:text-brand"
                        >
                          {b.listingTitle}
                        </Link>
                        <p className="truncate text-sm text-sand-700">
                          {b.listingLocation}, {b.listingRegion} · {t("bookings.bookedBy")} {b.guestName}
                        </p>
                      </div>
                      <p className="shrink-0 text-lg font-bold text-ink">{formatKes(b.totalKes)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-sand-200 pt-3 text-sm text-sand-700">
                      <span>
                        📅 {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                      </span>
                      <span>
                        {b.nights} {t("widget.night")}
                        {b.nights > 1 ? "s" : ""} · {b.guests} {t("widget.guest")}
                        {b.guests > 1 ? "s" : ""}
                      </span>
                      {b.transferRequested && b.transferFee > 0 && (
                        <span className="font-semibold text-ink">🚗 +{formatKes(b.transferFee)}</span>
                      )}
                      <div className="ml-auto flex flex-wrap items-center gap-2">
                        {b.status === "pending" && (
                          <button
                            onClick={() => act(b.id, "confirm")}
                            disabled={busyId === b.id}
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {busyId === b.id ? t("bookings.confirming") : t("bookings.confirmPay")}
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => {
                              if (window.confirm(t("bookings.cancelAsk"))) act(b.id, "cancel");
                            }}
                            disabled={busyId === b.id}
                            className="rounded-full border border-sand-400 px-3 py-1.5 text-xs font-bold text-sand-700 transition hover:border-brand hover:text-brand disabled:opacity-50"
                          >
                            {t("bookings.cancel")}
                          </button>
                        )}
                        {b.listingHostPhone && b.status !== "cancelled" && (
                          <a
                            href={waHref(b.listingHostPhone, b.listingTitle)}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-95"
                          >
                            💬 {t("bookings.contactHost")}
                          </a>
                        )}
                        <Link
                          href={`/listings/${b.listingSlug}`}
                          className="font-semibold text-brand hover:underline"
                        >
                          {t("bookings.viewStay")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-sand-600">💸 {t("bookings.refundNote")} · 🔒 Demo flow — no real money moves.</p>
        </div>
      )}
    </div>
  );
}
