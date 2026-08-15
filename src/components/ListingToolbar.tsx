"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryBar from "./CategoryBar";
import { KES_BANDS, PRICE_TIERS, REGIONS } from "@/lib/constants";
import { useT } from "./Localized";

type Params = Record<string, string | undefined>;

const SORTS: { value: string; key: "toolbar.recommended" | "toolbar.topRated" | "toolbar.mostReviewed" | "toolbar.priceLow" | "toolbar.priceHigh" }[] = [
  { value: "recommended", key: "toolbar.recommended" },
  { value: "rating", key: "toolbar.topRated" },
  { value: "reviews", key: "toolbar.mostReviewed" },
  { value: "price_asc", key: "toolbar.priceLow" },
  { value: "price_desc", key: "toolbar.priceHigh" },
];

export default function ListingToolbar({ params, count }: { params: Params; count: number }) {
  const router = useRouter();
  const t = useT();
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
  if (fTier) activeChips.push(t("tiers." + fTier as "tiers.budget"));
  if (fGuests > 0) activeChips.push(t("toolbar.guestsPlus", { n: fGuests }));
  if (fMin || fMax) activeChips.push(t("toolbar.kesRange", { min: fMin || "0", max: fMax || "∞" }));

  const tierTabs = [{ key: "", label: t("toolbar.allPrices"), icon: "🏷️" }, ...PRICE_TIERS.map((p) => ({ ...p, label: t("tiers." + p.key as "tiers.budget") }))];

  return (
    <div className="sticky top-[64px] z-30 -mx-4 border-b border-sand-200 bg-sand-50/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-3 pt-3">
        <CategoryBar
          active={activeType}
          onSelect={(key) => pushOne("type", key === "all" ? "" : key)}
        />
        <div className="flex shrink-0 items-center gap-2 pb-3">
          <button
            onClick={() => setFilters(true)}
            className="flex items-center gap-2 rounded-xl border border-sand-400 px-3 py-2 text-sm font-semibold hover:border-ink"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">{t("toolbar.filters")}</span>
            {activeChips.length > 0 && (
              <span className="brand-bg grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white">
                {activeChips.length}
              </span>
            )}
          </button>
          <select
            value={params.sort ?? "recommended"}
            onChange={(e) => pushOne("sort", e.target.value)}
            className="rounded-xl border border-sand-400 bg-white px-3 py-2 text-sm font-semibold outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {t(s.key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="no-scrollbar -mt-1 flex gap-2 overflow-x-auto pb-1">
        {KES_BANDS.map((n) => {
          const active = (params.maxPrice ?? "") === String(n);
          return (
            <button
              key={n}
              onClick={() => pushOne("maxPrice", active ? "" : String(n))}
              className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-sand-400 text-sand-800 hover:border-emerald-500"
              }`}
            >
              💸 {t("toolbar.underKes", { n: n.toLocaleString("en-KE") })}
            </button>
          );
        })}
        {tierTabs.map((t) => {
          const active = (params.tier ?? "") === t.key;
          return (
            <button
              key={t.key || "all"}
              onClick={() => pushOne("tier", t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? "border-brand bg-ember-50 text-brand"
                  : "border-sand-400 text-sand-800 hover:border-brand"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="pb-2 text-sm text-sand-700">
        {count} {t("toolbar.staysCount")}
        {fRegion ? ` ${t("toolbar.inRegion", { region: fRegion })}` : ` ${t("toolbar.acrossKenya")}`}
        {fTier ? ` · ${t("tiers." + fTier as "tiers.budget")}` : ""}
      </p>

      {filters && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/50 sm:items-center sm:justify-center" onClick={() => setFilters(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold">{t("toolbar.filters")}</h3>

            <label className="mb-1 block text-sm font-semibold">{t("toolbar.region")}</label>
            <select
              id="filter-region"
              defaultValue={fRegion}
              className="mb-4 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm"
            >
              <option value="">{t("toolbar.allRegions")}</option>
              {REGIONS.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            <label className="mb-1 block text-sm font-semibold">{t("toolbar.priceTier")}</label>
            <select
              id="filter-tier"
              defaultValue={fTier}
              className="mb-4 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm"
            >
              <option value="">{t("toolbar.anyTier")}</option>
              {PRICE_TIERS.map((tier) => (
                <option key={tier.key} value={tier.key}>
                  {t("tiers." + tier.key as "tiers.budget")} —{" "}
                  {t(
                    (tier.key === "budget" ? "tiers.blurbBudget" : tier.key === "mid" ? "tiers.blurbMid" : "tiers.blurbLuxury") as "tiers.blurbBudget",
                  )}
                </option>
              ))}
            </select>

            <label className="mb-1 block text-sm font-semibold">{t("toolbar.priceNight")}</label>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <input
                id="filter-min"
                type="number"
                placeholder={t("toolbar.min")}
                defaultValue={fMin}
                className="rounded-xl border border-sand-400 px-3 py-2 text-sm"
              />
              <input
                id="filter-max"
                type="number"
                placeholder={t("toolbar.max")}
                defaultValue={fMax}
                className="rounded-xl border border-sand-400 px-3 py-2 text-sm"
              />
            </div>

            <label className="mb-1 block text-sm font-semibold">{t("search.guests")}</label>
            <input
              id="filter-guests"
              type="number"
              min={0}
              defaultValue={fGuests || ""}
              placeholder="e.g. 2"
              className="mb-6 w-full rounded-xl border border-sand-400 px-3 py-2 text-sm"
            />

            <div className="flex justify-between">
              <button
                onClick={() => pushMany({ region: "", tier: "", guests: "", minPrice: "", maxPrice: "" })}
                className="rounded-xl px-4 py-2 text-sm font-bold underline"
              >
                {t("search.clear")}
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
                {t("toolbar.showStays")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
