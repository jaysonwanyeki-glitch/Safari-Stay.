"use client";

import { useSyncExternalStore } from "react";
import { emptyTrip, normalizeTrip, type Trip, type TripItem } from "./trip";

// The legacy key is kept so existing saved stays migrate automatically — the
// stored shape grew from a plain number[] into a Trip object.
const STORAGE_KEY = "safari:wishlist";
const CHANGE_EVENT = "safari:wishlist-change";

export type { Trip, TripItem };

export function readTrip(): Trip {
  if (typeof window === "undefined") return emptyTrip();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyTrip();
    const parsed = JSON.parse(raw) as unknown;
    // Backwards-compatible with the old plain number[] wishlist.
    if (Array.isArray(parsed)) {
      return normalizeTrip({
        name: "",
        items: parsed.map((n) =>
          typeof n === "number" ? { id: n, day: 0, nights: 1 } : n,
        ),
      });
    }
    return normalizeTrip(parsed);
  } catch {
    return emptyTrip();
  }
}

// The parsed trip is cached so useSyncExternalStore's snapshot stays
// referentially stable between change events (avoids infinite re-renders).
let cache: Trip | null = null;
function snapshot(): Trip {
  if (!cache) cache = readTrip();
  return cache;
}

function subscribe(callback: () => void) {
  const onChange = () => {
    cache = null;
    callback();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function saveTrip(trip: Trip) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  cache = null;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Reactive trip — driven by an external store (localStorage). */
export function useTrip(): Trip {
  return useSyncExternalStore(subscribe, snapshot, emptyTrip);
}

export function readWishlist(): number[] {
  return readTrip().items.map((i) => i.id);
}

/** Reactive `is id in trip` — powers the ♥ buttons. */
export function useWishlist(id: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => readTrip().items.some((i) => i.id === id),
    () => false,
  );
}

/** Toggle a stay in the trip (adds it unscheduled, or removes it). */
export function toggleWishlist(id: number): void {
  const trip = readTrip();
  const idx = trip.items.findIndex((i) => i.id === id);
  if (idx >= 0) trip.items.splice(idx, 1);
  else trip.items.push({ id, day: 0, nights: 1 });
  saveTrip(trip);
}

/** Update day / nights for a saved stay. */
export function setTripItem(id: number, patch: Partial<TripItem>): void {
  const trip = readTrip();
  const item = trip.items.find((i) => i.id === id);
  if (!item) return;
  if (patch.day != null) item.day = Math.max(0, Math.floor(patch.day));
  if (patch.nights != null)
    item.nights = Math.max(1, Math.min(30, Math.floor(patch.nights)));
  saveTrip(trip);
}

export function setTripName(name: string): void {
  const trip = readTrip();
  trip.name = name.slice(0, 80);
  saveTrip(trip);
}

export function clearTrip(): void {
  saveTrip(emptyTrip());
}
