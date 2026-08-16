"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useT, type TKey, type TVars } from "./Localized";
import { HeartIcon } from "./icons";
import { clearTrip, setTripItem, setTripName, toggleWishlist, useTrip } from "@/lib/wishlist";
import { encodeTrip } from "@/lib/trip";
import { formatKes } from "@/lib/format";
import type { PublicListing } from "@/lib/data";

type Row = { id: number; day: number; nights: number; listing: PublicListing };
type TFunc = (key: TKey, vars?: TVars) => string;

export default function TripPlanner({ listings }: { listings: PublicListing[] }) {
  const t = useT();
  const trip = useTrip();
  const byId = useMemo(() => new Map(listings.map((l) => [l.id, l])), [listings]);
  const [name, setName] = useState(trip.name);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const committedName = useRef(trip.name);

  // Sync the input when a named trip loads from localStorage (post-hydration),
  // without clobbering text the user is currently typing.
  useEffect(() => {
    if (trip.name !== committedName.current) {
      committedName.current = trip.name;
      setName(trip.name);
    }
  }, [trip.name]);

  const rows: Row[] = useMemo(
    () =>
      trip.items
        .map((it) => ({ ...it, listing: byId.get(it.id) }))
        .filter((r): r is Row => !!r.listing),
    [trip.items, byId],
  );

  const maxDay = rows.reduce((m, r) => Math.max(m, r.day), 0);
  const unscheduled = rows.filter((r) => r.day === 0);
  const dayMap = new Map<number, Row[]>();
  for (const r of rows) {
    if (r.day === 0) continue;
    const list = dayMap.get(r.day) ?? [];
    list.push(r);
    dayMap.set(r.day, list);
  }
  const dayNumbers = [...dayMap.keys()].sort((a, b) => a - b);

  const totalNights = rows.reduce((s, r) => s + r.nights, 0);
  const estimate = rows.reduce((s, r) => s + r.listing.pricePerNight * r.nights, 0);

  function commitName() {
    if (name.trim() !== trip.name) {
      committedName.current = name.trim();
      setTripName(name.trim());
    }
  }

  function shareUrl() {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/trip/share?t=${encodeTrip(trip)}`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the visible input lets users copy manually.
    }
  }

  if (rows.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-sand-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember-50 text-3xl">
          <HeartIcon className="h-8 w-8 text-ember-500" />
        </div>
        <h2 className="font-display mt-4 text-xl font-bold text-ink">{t("trip.emptyTitle")}</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-sand-700">{t("trip.emptySub")}</p>
        <Link
          href="/listings"
          className="brand-bg mt-6 inline-block rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg"
        >
          {t("trip.emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Trip header */}
      <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label className="text-xs font-bold uppercase tracking-wide text-sand-500">
              {t("trip.title")}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              placeholder={t("trip.namePlaceholder")}
              className="mt-1 w-full max-w-md rounded-xl border border-sand-300 px-3 py-2 text-lg font-bold text-ink outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShareOpen((o) => !o)}
              className="brand-bg flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            >
              🔗 {t("trip.share")}
            </button>
            <button
              onClick={() => {
                if (window.confirm(t("trip.clearConfirm"))) clearTrip();
              }}
              className="rounded-full border border-sand-300 px-5 py-2.5 text-sm font-bold text-sand-700 transition hover:border-ember-400 hover:text-ember-600"
            >
              {t("trip.clear")}
            </button>
          </div>
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-extrabold text-ink">{t("trip.stays", { n: rows.length })}</span>
          <span className="text-sand-400" aria-hidden>
            ·
          </span>
          <span className="font-extrabold text-ink">{t("trip.nights", { n: totalNights })}</span>
          <span className="text-sand-400" aria-hidden>
            ·
          </span>
          <span className="font-extrabold text-brand">{t("trip.estFrom", { n: formatKes(estimate) })}</span>
        </p>

        {shareOpen && (
          <div className="mt-5 rounded-2xl border border-brand/30 bg-ember-50/50 p-4">
            <p className="text-sm font-bold text-ink">{t("trip.shareTitle")}</p>
            <p className="mt-0.5 text-xs text-sand-700">{t("trip.shareSub")}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={shareUrl()}
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 rounded-xl border border-sand-300 bg-white px-3 py-2 text-xs text-sand-700 outline-none focus:border-brand"
              />
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="brand-bg rounded-xl px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
                >
                  {copied ? t("trip.copied") : t("trip.copy")}
                </button>
                <a
                  href={shareUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-sand-300 bg-white px-4 py-2 text-xs font-bold text-ink transition hover:border-brand hover:text-brand"
                >
                  {t("trip.open")} ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route timeline */}
      <div>
        <h2 className="font-display text-xl font-bold text-ink">{t("trip.route")}</h2>
        <div className="mt-4 space-y-4">
          {dayNumbers.map((day, i) => (
            <div key={day}>
              <div className="flex items-center gap-3">
                <span className="brand-bg grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white">
                  {day}
                </span>
                <h3 className="font-bold text-ink">{t("trip.day", { n: day })}</h3>
                {i < dayNumbers.length - 1 && (
                  <span className="text-sm text-sand-500" aria-hidden>
                    ↓
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-3">
                {dayMap.get(day)!.map((r) => (
                  <TripRow key={r.id} row={r} t={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unscheduled */}
      {unscheduled.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-ink">{t("trip.unscheduled")}</h2>
          <p className="mt-0.5 text-sm text-sand-600">{t("trip.unscheduledSub")}</p>
          <div className="mt-3 space-y-3">
            {unscheduled.map((r) => (
              <TripRow key={r.id} row={r} t={t} moveTo={maxDay + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TripRow({ row, t, moveTo }: { row: Row; t: TFunc; moveTo?: number }) {
  const { listing } = row;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-sand-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
      <Link href={`/listings/${listing.slug}`} className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.imageUrls[0]}
          alt={listing.title}
          loading="lazy"
          className="h-24 w-full rounded-xl object-cover sm:h-16 sm:w-24"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/listings/${listing.slug}`} className="font-bold text-ink transition hover:text-brand">
          {listing.title}
        </Link>
        <p className="text-xs text-sand-600">
          {listing.locationName}
          {listing.county ? ` · ${listing.county}` : ""}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-brand">
          {formatKes(listing.pricePerNight)}{" "}
          <span className="text-xs font-normal text-sand-500">{t("trip.perNight")}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2.5">
        {/* Nights */}
        <div className="flex items-center gap-2 rounded-full border border-sand-300 px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-sand-500">
            {t("trip.nightsLabel")}
          </span>
          <button
            aria-label="−"
            onClick={() => setTripItem(row.id, { nights: row.nights - 1 })}
            disabled={row.nights <= 1}
            className="grid h-6 w-6 place-items-center rounded-full bg-sand-100 text-sm font-bold disabled:opacity-40"
          >
            –
          </button>
          <span className="w-4 text-center text-sm font-bold">{row.nights}</span>
          <button
            aria-label="+"
            onClick={() => setTripItem(row.id, { nights: row.nights + 1 })}
            className="grid h-6 w-6 place-items-center rounded-full bg-sand-100 text-sm font-bold"
          >
            +
          </button>
        </div>
        {/* Day */}
        <div className="flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5">
          <button
            aria-label="−"
            onClick={() => setTripItem(row.id, { day: Math.max(0, row.day - 1) })}
            disabled={row.day === 0}
            className="grid h-6 w-6 place-items-center rounded-full bg-sand-100 text-sm font-bold disabled:opacity-40"
          >
            –
          </button>
          <span className="min-w-9 text-center text-xs font-bold">
            {row.day > 0 ? t("trip.day", { n: row.day }) : t("trip.unscheduled")}
          </span>
          <button
            aria-label="+"
            onClick={() => setTripItem(row.id, { day: row.day + 1 })}
            className="grid h-6 w-6 place-items-center rounded-full bg-sand-100 text-sm font-bold"
          >
            +
          </button>
        </div>
        {moveTo && (
          <button
            onClick={() => setTripItem(row.id, { day: moveTo })}
            className="rounded-full border border-brand/40 bg-ember-50 px-3 py-1.5 text-xs font-bold text-brand transition hover:bg-ember-100"
          >
            {t("trip.moveTo", { n: moveTo })}
          </button>
        )}
        <button
          onClick={() => toggleWishlist(row.id)}
          aria-label={t("trip.remove")}
          className="grid h-8 w-8 place-items-center rounded-full text-ember-500 transition hover:bg-ember-50"
        >
          <HeartIcon filled className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
