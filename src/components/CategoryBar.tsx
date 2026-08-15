"use client";

import { CATEGORIES } from "@/lib/constants";
import { useT } from "./Localized";

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
              <span className="whitespace-nowrap">{c.key === "all" ? t("categories.all") : c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
