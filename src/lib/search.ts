// ---------------------------------------------------------------- Smart search
// The header search bar is the site's front door: type a region, a conservancy,
// a town or a fun activity and we route you to the right page — region filter,
// radius search beside the place, or the activities directory.

import { REGIONS } from "@/lib/constants";
import { siteDirectory } from "@/lib/nearby";
import { MAJOR_STAGES } from "@/lib/travel";
import { ACTIVITIES, ACTIVITY_EMOJI } from "@/lib/activities";

export type SuggestionKind = "region" | "site" | "activity" | "town";

export type SearchSuggestion = {
  kind: SuggestionKind;
  label: string;
  sub: string;
  emoji: string;
  href: string;
};

const KIND_ORDER: SuggestionKind[] = ["region", "site", "activity", "town"];

/** Live suggestions for the search box, grouped by kind, capped per group. */
export function searchSuggestions(query: string): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  const out: SearchSuggestion[] = [];
  const seen = new Set<string>();

  const push = (s: SearchSuggestion) => {
    const key = `${s.kind}:${s.href}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  };

  if (!q) return [];

  // 1. Regions (e.g. "Nairobi", "Coast", "Western Kenya")
  for (const r of REGIONS) {
    if (r.name.toLowerCase().includes(q)) {
      push({
        kind: "region",
        label: r.name,
        sub: r.blurb,
        emoji: "🗺️",
        href: `/listings?region=${encodeURIComponent(r.name)}`,
      });
    }
  }

  // 2. Conservancies, parks, beaches & sites (canonical name → radius search)
  for (const s of siteDirectory()) {
    if (s.name.toLowerCase().includes(q)) {
      push({
        kind: "site",
        label: s.name,
        sub: s.distance,
        emoji: s.emoji,
        href: `/listings?near=${encodeURIComponent(s.name)}`,
      });
    }
  }

  // 3. Fun activities (name, place, category or blurb)
  for (const act of ACTIVITIES) {
    if (
      act.name.toLowerCase().includes(q) ||
      act.location.toLowerCase().includes(q) ||
      act.blurb.toLowerCase().includes(q) ||
      act.category.replace(/_/g, " ").includes(q)
    ) {
      push({
        kind: "activity",
        label: act.name,
        sub: act.location,
        emoji: ACTIVITY_EMOJI[act.category] ?? "🎉",
        href: `/activities#${act.id}`,
      });
    }
  }

  // 4. Towns & stages (→ matching stays)
  for (const t of MAJOR_STAGES) {
    if (t.town.toLowerCase().includes(q)) {
      push({
        kind: "town",
        label: t.town,
        sub: `${t.county} · ${t.stage}`,
        emoji: "🚌",
        href: `/listings?q=${encodeURIComponent(t.town)}`,
      });
    }
  }

  return out
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind))
    .slice(0, 10);
}

/** Decide where a bare query should go — used by the header Search button. */
export function routeForQuery(query: string): string {
  const q = query.trim();
  if (!q) return "/listings";

  const lower = q.toLowerCase();

  const region = REGIONS.find((r) => r.name.toLowerCase() === lower);
  if (region) return `/listings?region=${encodeURIComponent(region.name)}`;

  const site = siteDirectory().find((s) => s.name.toLowerCase().includes(lower));
  if (site) return `/listings?near=${encodeURIComponent(site.name)}`;

  const act = ACTIVITIES.find(
    (x) =>
      x.name.toLowerCase().includes(lower) ||
      x.location.toLowerCase().includes(lower) ||
      x.category.replace(/_/g, " ").includes(lower),
  );
  if (act) return `/activities#${act.id}`;

  const town = MAJOR_STAGES.find((t) => t.town.toLowerCase().includes(lower));
  if (town) return `/listings?q=${encodeURIComponent(town.town)}`;

  return `/listings?q=${encodeURIComponent(q)}`;
}

/** Quick chips shown when the search box is empty. */
export const POPULAR_SEARCHES: { label: string; emoji: string; href: string }[] = [
  { label: "Naboisho", emoji: "🦁", href: routeForQuery("Naboisho") },
  { label: "Diani Beach", emoji: "🏖️", href: routeForQuery("Diani Beach") },
  { label: "Ol Pejeta", emoji: "🦏", href: routeForQuery("Ol Pejeta") },
  { label: "Hells Gate", emoji: "🚴", href: routeForQuery("Hells Gate") },
  { label: "Samburu", emoji: "🦓", href: routeForQuery("Samburu") },
  { label: "Mount Kenya", emoji: "🏔️", href: routeForQuery("Mount Kenya") },
  { label: "Watamu Marine", emoji: "🐢", href: routeForQuery("Watamu Marine") },
  { label: "Horse riding", emoji: "🐎", href: routeForQuery("horse riding") },
  { label: "Skating", emoji: "🛼", href: routeForQuery("skating") },
  { label: "Cooking", emoji: "🍛", href: routeForQuery("cooking") },
  { label: "Red Cross", emoji: "❤️", href: routeForQuery("Red Cross") },
  { label: "Wild Waters", emoji: "🎢", href: routeForQuery("Wild Waters") },
];
