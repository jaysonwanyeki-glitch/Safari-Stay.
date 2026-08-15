"use client";

import { useLocale } from "@/lib/locale";

const WORDS = {
  en: {
    guest: ["guest", "guests"],
    bedroom: ["bedroom", "bedrooms"],
    bed: ["bed", "beds"],
    bath: ["bath", "baths"],
  },
  sw: {
    guest: ["mgeni", "wageni"],
    bedroom: ["chumba", "vyumba"],
    bed: ["kitanda", "vitanda"],
    bath: ["bafu", "bafu"],
  },
} as const;

function part(n: number, locale: "en" | "sw", key: keyof (typeof WORDS)["en"]) {
  const w = WORDS[locale][key];
  return `${n} ${w[n === 1 ? 0 : 1]}`;
}

/** "4 guests · 2 bedrooms · 2 beds · 2 baths" — with correct Swahili plurals. */
export default function Occupancy({
  guests,
  bedrooms,
  beds,
  baths,
}: {
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}) {
  const locale = useLocale();
  return (
    <span>
      {part(guests, locale, "guest")} · {part(bedrooms, locale, "bedroom")} · {part(beds, locale, "bed")} ·{" "}
      {part(baths, locale, "bath")}
    </span>
  );
}
