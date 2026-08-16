/**
 * Trip model — a day-by-day route of saved stays.
 *
 * Isomorphic (no "use client"): the client planner builds trips and encodes
 * them into share URLs, the server share view decodes and renders them.
 */

export type TripItem = {
  /** Listing id (matches the catalogue / seed). */
  id: number;
  /** Route day (1-based). 0 = saved but not scheduled yet. */
  day: number;
  /** Nights at this stay. */
  nights: number;
};

export type Trip = {
  name: string;
  items: TripItem[];
};

export function emptyTrip(): Trip {
  return { name: "", items: [] };
}

/** Validate + coerce an unknown value into a Trip (lenient, never throws). */
export function normalizeTrip(value: unknown): Trip {
  if (!value || typeof value !== "object") return emptyTrip();
  const t = value as { name?: unknown; items?: unknown };
  const items = Array.isArray(t.items) ? t.items : [];
  return {
    name: typeof t.name === "string" ? t.name.slice(0, 80) : "",
    items: items
      .filter((it): it is Record<string, unknown> => !!it && typeof it === "object")
      .map((it) => ({
        id:
          typeof it.id === "number" && Number.isFinite(it.id) && it.id > 0
            ? Math.floor(it.id)
            : 0,
        day: typeof it.day === "number" && it.day >= 0 ? Math.floor(it.day) : 0,
        nights:
          typeof it.nights === "number" && it.nights >= 1
            ? Math.min(30, Math.floor(it.nights))
            : 1,
      }))
      .filter((it) => it.id > 0),
  };
}

/** Compact, unicode-safe encoding for share URLs (?t=…). */
export function encodeTrip(trip: Trip): string {
  return encodeURIComponent(JSON.stringify(normalizeTrip(trip)));
}

/** Decode + validate a trip from a share URL. Returns null when invalid/empty. */
export function decodeTrip(raw: string): Trip | null {
  if (!raw) return null;
  try {
    const trip = normalizeTrip(JSON.parse(decodeURIComponent(raw)));
    return trip.items.length > 0 ? trip : null;
  } catch {
    return null;
  }
}
