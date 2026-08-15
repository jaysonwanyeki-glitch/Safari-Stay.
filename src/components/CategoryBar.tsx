"use client";

import { CATEGORIES } from "@/lib/constants";
import { useT, type TKey } from "./Localized";

const CAT_TKEY: Record<string, TKey> = {
  all: "categories.all",
  safari_lodge: "categories.safari_lodge",
  beach_resort: "categories.beach_resort",
  beach_villa: "categories.beach_villa",
  apartment: "categories.apartment",
  cottage: "categories.cottage",
  bush_villa: "categories.bush_villa",
  guesthouse: "categories.guesthouse",
  backpacker: "categories.backpacker",
  campsite: "categories.campsite",
  tented_camp: "categories.tented_camp",
  eco_camp: "categories.eco_camp",
  farm_stay: "categories.farm_stay",
};

type Props = {
  active: string;
  onSelect: (key: string) => void;
  className?: string;
};

export default function CategoryBar({ active, onSelect, className = "" }: Props) {
  const t = useT();
  return (
    <div className={`no-scrollbar overflow-x-auto ${className}`}>
      <div className="flex min-w-max items-stretch gap-2">
        {CATEGORIES.map((c) => {
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onSelect(c.key)}
              className={`flex flex-col items-center gap-1 border-b-2 px-3 pb-3 pt-1 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-ink text-ink"
                  : "border-transparent text-sand-700 hover:text-ink"
              }`}
            >
              <span className="text-2xl leading-none">{c.icon}</span>
              <span className="whitespace-nowrap">{t(CAT_TKEY[c.key] ?? "categories.all")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
