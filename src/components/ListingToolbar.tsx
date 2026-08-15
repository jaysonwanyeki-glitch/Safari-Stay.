"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryBar from "./CategoryBar";
import { PRICE_TIERS, REGIONS, TIER_LABEL } from "@/lib/constants";

type Params = Record<string, string | undefined>;

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Most reviewed" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export default function ListingToolbar({ params, count }: { params: Params; count: number }) {
  const router = useRouter();
  const [filters, setFilters] = useState(false);

  const fRegion = params.region ?? "";
  const fTier = params.tier ?? "";
  const fGuests = Number(params.guests ?? "0");
  const fMin = params.minPrice ?? "";
  const fMax = params.maxPrice ?? "";

  function pushOne(key: string, value: string) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`/listings?${sp.toString()}`);
  }

  function pushMany(next: Partial<Record<string, string>>) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && !(k in next)) sp.set(k, v);
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    router.push(`/listings?${sp.toString()}`);
  }

  const activeType = params.type ?? "all";
  const activeChips: string[] = [];
  if (fRegion) activeChips.push(fRegion);
  if (fTier) activeChips.push(TIER_LABEL[fTier] ?? fTier);
  if (fGuests > 0) activeChips.push(`${fGuests}+ guests`);
  if (fMin || fMax) activeChips.push(`KES ${fMin || "0"}–${fMax || "∞"}`);

  const tierTabs = [{ key: "", label: "All prices", icon: "🏷️" }, ...PRICE_TIERS];

  return (
    <div className="sticky top-[64px] z-30 -mx-4 border-b border-slate-200 bg-white px-4 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-3 pt-3">
        <CategoryBar
          active={activeType}
          onSelect={(key) => pushOne("type", key === "all" ? "" : key)}
        />
        <div className="flex shrink-0 items-center gap-2 pb-3">
          <button
            onClick={() => setFilters(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-slate-800"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Filters</span>
            {activeChips.length > 0 && (
              <span className="brand-bg grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white">
                {activeChips.length}
              </span>
            )}
          </button>
          <select
            value={params.sort ?? "recommended"}
            onChange={(e) => pushOne("sort", e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="no-scrollbar -mt-1 flex gap-2 overflow-x-auto pb-1">
        {tierTabs.map((t) => {
          const active = (params.tier ?? "") === t.key;
          return (
            <button
              key={t.key || "all"}
              onClick={() => pushOne("tier", t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? "border-brand bg-rose-50 text-brand"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="pb-2 text-sm text-slate-500">
        {count} {count === 1 ? "stay" : "stays"}
        {fRegion ? ` in ${fRegion}` : " across Kenya"}
        {fTier ? ` · ${TIER_LABEL[fTier]}` : ""}
      </p>

      {filters && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/50 sm:items-center sm:justify-center" onClick={() => setFilters(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold">Filters</h3>

            <label className="mb-1 block text-sm font-semibold">Region</label>
            <select
              id="filter-region"
              defaultValue={fRegion}
              className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All regions</option>
              {REGIONS.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            <label className="mb-1 block text-sm font-semibold">Price tier</label>
            <select
              id="filter-tier"
              defaultValue={fTier}
              className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Any tier</option>
              {PRICE_TIERS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label} — {t.blurb}
                </option>
              ))}
            </select>

            <label className="mb-1 block text-sm font-semibold">Price per night (KES)</label>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <input
                id="filter-min"
                type="number"
                placeholder="Min"
                defaultValue={fMin}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                id="filter-max"
                type="number"
                placeholder="Max"
                defaultValue={fMax}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <label className="mb-1 block text-sm font-semibold">Guests</label>
            <input
              id="filter-guests"
              type="number"
              min={0}
              defaultValue={fGuests || ""}
              placeholder="e.g. 2"
              className="mb-6 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />

            <div className="flex justify-between">
              <button
                onClick={() => pushMany({ region: "", tier: "", guests: "", minPrice: "", maxPrice: "" })}
                className="rounded-xl px-4 py-2 text-sm font-bold underline"
              >
                Clear all
              </button>
              <button
                onClick={() => {
                  const region = (document.getElementById("filter-region") as HTMLSelectElement).value;
                  const tier = (document.getElementById("filter-tier") as HTMLSelectElement).value;
                  const min = (document.getElementById("filter-min") as HTMLInputElement).value;
                  const max = (document.getElementById("filter-max") as HTMLInputElement).value;
                  const guests = (document.getElementById("filter-guests") as HTMLInputElement).value;
                  pushMany({ region, tier, minPrice: min, maxPrice: max, guests });
                  setFilters(false);
                }}
                className="brand-bg rounded-xl px-6 py-2 text-sm font-bold text-white"
              >
                Show stays
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
