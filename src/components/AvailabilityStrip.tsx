"use client";

import { useState } from "react";
import type { BookedRange } from "@/lib/data";
import { PICK_CHECKIN_EVENT, type PickCheckinDetail } from "@/lib/events";
import { useT } from "./Localized";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function localIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * "Booked dates" availability strip — a compact, navigable calendar showing
 * which nights are already taken (from real bookings). Guests can scan ahead
 * with next/prev month buttons; clicking the month label returns to today.
 */
export default function AvailabilityStrip({
  ranges,
  listingId,
}: {
  ranges: BookedRange[];
  listingId: number;
}) {
  const t = useT();
  const [offset, setOffset] = useState(0);

  const now = new Date();
  const baseYear = now.getFullYear();
  const baseMonth = now.getMonth();
  const viewYear = baseYear + Math.floor((baseMonth + offset) / 12);
  const viewMonth = ((baseMonth + offset) % 12 + 12) % 12;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday-first
  const todayIso = localIso(now);

  const bookedSet = new Set<string>();
  for (const r of ranges) {
    const start = new Date(r.checkIn + "T00:00:00");
    const end = new Date(r.checkOut + "T00:00:00");
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) bookedSet.add(localIso(d));
    }
  }

  // Only unbooked nights from today onward are actually bookable.
  let availableNights = 0;
  const firstCountDay = offset === 0 ? now.getDate() : 1;
  for (let d = new Date(viewYear, viewMonth, firstCountDay); d.getMonth() === viewMonth; d.setDate(d.getDate() + 1)) {
    if (!bookedSet.has(localIso(d))) availableNights++;
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-sand-200 bg-white/90 p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold">{t("strip.title")}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label={t("strip.prev")}
            className="grid h-7 w-7 place-items-center rounded-full border border-sand-300 text-sm text-ink transition hover:bg-sand-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ‹
          </button>
          <button
            onClick={() => setOffset(0)}
            title={offset === 0 ? t("strip.thisMonth") : t("strip.backMonth")}
            className="min-w-[8.5rem] rounded-full px-3 py-1 text-xs font-bold text-sand-700 transition hover:bg-sand-100"
          >
            {monthLabel}
          </button>
          <button
            onClick={() => setOffset((o) => o + 1)}
            aria-label={t("strip.next")}
            className="grid h-7 w-7 place-items-center rounded-full border border-sand-300 text-sm text-ink transition hover:bg-sand-100"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-[10px] font-bold uppercase tracking-wide text-sand-600">
            {w}
          </div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const booked = bookedSet.has(iso);
          const past = iso < todayIso;
          const isToday = iso === todayIso;
          const cell = booked
            ? "bg-brand text-white"
            : past
              ? "bg-sand-100/60 text-sand-400"
              : "bg-sand-50 text-ink";
          const base = `grid h-8 place-items-center rounded-lg text-xs font-semibold ${cell} ${
            isToday ? "ring-2 ring-brand ring-offset-1" : ""
          }`;
          const clickable = !booked && !past;
          return clickable ? (
            <button
              key={day}
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent<PickCheckinDetail>(PICK_CHECKIN_EVENT, {
                    detail: { date: iso, listingId },
                  }),
                )
              }
              aria-label={`Select ${iso} as check-in`}
              title="Set as check-in"
              className={`${base} cursor-pointer transition hover:bg-sand-200 hover:ring-2 hover:ring-brand/40`}
            >
              {day}
            </button>
          ) : (
            <div key={day} title={booked ? "Booked" : "Past"} className={base}>
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sand-700">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" /> {t("strip.booked")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sand-50 ring-1 ring-sand-200" /> {t("strip.available")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sand-100/60" /> {t("strip.past")}
        </span>
        <span className="ml-auto font-bold text-ink">
          {availableNights} {offset === 0 ? t("strip.freeFromToday") : t("strip.free")}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-sand-600">{t("strip.hint")}</p>
    </div>
  );
}
