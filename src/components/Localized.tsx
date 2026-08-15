"use client";

import { useLocale } from "@/lib/locale";
import { translate, type Locale, type TKey } from "@/lib/i18n";

export type { TKey };
export type TVars = Record<string, string | number>;

/** Translation function for the current locale: `t("widget.total")`. */
export function useT(): (key: TKey, vars?: TVars) => string {
  const locale = useLocale();
  return (key, vars) => translate(key, locale, vars);
}

/** Current locale itself, for switch labels. */
export function useLocaleName(): Locale {
  return useLocale();
}

/** Inline translated text: `<T k="hero.title" />`. Safe in server components. */
export function T({
  k,
  vars,
  className,
}: {
  k: TKey;
  vars?: TVars;
  className?: string;
}) {
  const t = useT();
  return <span className={className}>{t(k, vars)}</span>;
}
