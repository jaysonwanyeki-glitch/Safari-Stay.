/**
 * Real Kenya tourism seasons.
 * - Peak (high): Jul 1 – Oct 31 (Great Migration) & Dec 20 – Jan 5 (festive)
 * - Green (low): Mar 1 – May 31 (long rains)
 * - Shoulder: everything else (Feb, Jun, Nov, early Dec, Jan 6+)
 *
 * Published lodge rates track these seasons, so nightly prices shift with the
 * dates a guest selects.
 */

export type Season = "peak" | "shoulder" | "green";

export function seasonForDate(date: Date): Season {
  const m = date.getMonth() + 1; // 1..12
  const d = date.getDate();
  if ((m >= 7 && m <= 10) || (m === 12 && d >= 20) || (m === 1 && d <= 5)) return "peak";
  if (m === 3 || m === 4 || m === 5) return "green";
  return "shoulder";
}

export const SEASON_LABEL: Record<Season, string> = {
  peak: "Peak season",
  shoulder: "Shoulder season",
  green: "Green season",
};

export const SEASON_EMOJI: Record<Season, string> = {
  peak: "🔥",
  shoulder: "⛅",
  green: "🌿",
};

export const SEASON_BLURB: Record<Season, string> = {
  peak: "Great Migration & festive high season — the wildest time in Kenya.",
  shoulder: "Excellent value with superb game viewing on either side of peak.",
  green: "Lush landscapes, big discounts and near-private safaris.",
};

export type RateFields = { pricePerNight: number; peakPricePerNight: number };

/** Nightly KES rate for a specific date, following the published seasonal model. */
export function priceForDate(fields: RateFields, date: Date): number {
  const s = seasonForDate(date);
  if (s === "peak") return fields.peakPricePerNight;
  if (s === "green") return fields.pricePerNight;
  return Math.round((fields.pricePerNight + fields.peakPricePerNight) / 2);
}

/** Total for a stay (checkIn..checkOut exclusive of checkout night), averaged per night. */
export function stayTotal(fields: RateFields, checkIn: string, checkOut: string): number {
  const start = new Date(checkIn + "T00:00:00");
  const end = new Date(checkOut + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;
  const nights = Math.round((end.getTime() - start.getTime()) / 86400000);
  let total = 0;
  for (let i = 0; i < nights; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    total += priceForDate(fields, day);
  }
  return total;
}

// ------------------------------------------------------------ Kenyan pricing
// Real Kenyan BNB reality: hosts negotiate. Long stays (28+ nights, a common
// remote-work / family-relocation pattern) and big groups (weddings, harambee
// gatherings, chama retreats) get published discounts — shown transparently.

export type DiscountInfo = {
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  nights: number;
};

/**
 * Room subtotal with Kenya-style negotiated discounts applied.
 * Monthly stays (28+ nights) take priority over group discounts.
 */
export function stayPricing(
  fields: RateFields & { monthlyDiscountPct: number; groupDiscountPct: number },
  checkIn: string,
  checkOut: string,
  guests: number,
): DiscountInfo {
  const start = new Date(checkIn + "T00:00:00");
  const end = new Date(checkOut + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return { subtotal: 0, discount: 0, discountLabel: null, nights: 0 };
  }
  const nights = Math.round((end.getTime() - start.getTime()) / 86400000);
  let subtotal = 0;
  for (let i = 0; i < nights; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    subtotal += priceForDate(fields, day);
  }

  let discount = 0;
  let discountLabel: string | null = null;
  if (nights >= 28 && fields.monthlyDiscountPct > 0) {
    discount = Math.round((subtotal * fields.monthlyDiscountPct) / 100);
    discountLabel = `Monthly rate (28+ nights) · ${fields.monthlyDiscountPct}% off`;
  } else if (guests >= 5 && fields.groupDiscountPct > 0) {
    discount = Math.round((subtotal * fields.groupDiscountPct) / 100);
    discountLabel = `Group rate (${guests} guests) · ${fields.groupDiscountPct}% off`;
  }
  return { subtotal, discount, discountLabel, nights };
}
