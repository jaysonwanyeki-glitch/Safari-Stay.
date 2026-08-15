/**
 * Live USD ⇄ KES rates from the free ExchangeRate-API open endpoint.
 * Rates only update daily, so we cache the response server-side for 12h.
 * Attribution: ExchangeRate-API (open.er-api.com).
 */

const FALLBACK_USD_TO_KES = 129; // reference mid-market rate
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const globalForCurrency = globalThis as unknown as {
  __safariUsdToKes?: { rate: number; at: number };
};

async function fetchRate(): Promise<number> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", {
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error("rate fetch failed");
  const json = (await res.json()) as { rates?: Record<string, number> };
  const rate = json.rates?.KES;
  if (typeof rate !== "number" || rate <= 0) throw new Error("bad rate payload");
  return rate;
}

/** 1 USD = X KES (live, cached). Falls back to the last known or reference rate. */
export async function getUsdToKes(): Promise<number> {
  const cached = globalForCurrency.__safariUsdToKes;
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.rate;
  try {
    const rate = await fetchRate();
    globalForCurrency.__safariUsdToKes = { rate, at: Date.now() };
    return rate;
  } catch {
    if (cached) return cached.rate;
    return FALLBACK_USD_TO_KES;
  }
}

export async function kesToUsd(kes: number): Promise<number> {
  const rate = await getUsdToKes();
  return kes / rate;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
