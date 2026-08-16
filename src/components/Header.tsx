"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, setLocale, readLocale } from "@/lib/locale";
import { POPULAR_SEARCHES, routeForQuery, searchSuggestions, type SuggestionKind } from "@/lib/search";
import { useT } from "./Localized";
import { GlobeIcon, HeartIcon, SearchIcon } from "./icons";
import { useTrip } from "@/lib/wishlist";
import Logo from "./Logo";

const KIND_KEY: Record<SuggestionKind, "search.kindRegion" | "search.kindSite" | "search.kindActivity" | "search.kindTown"> = {
  region: "search.kindRegion",
  site: "search.kindSite",
  activity: "search.kindActivity",
  town: "search.kindTown",
};

export default function Header() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const trip = useTrip();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"where" | "when" | "who">("where");
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => searchSuggestions(query), [query]);

  // Keep <html lang> in sync with the saved locale on first paint.
  useEffect(() => {
    document.documentElement.lang = readLocale();
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (open && tab === "where") inputRef.current?.focus();
  }, [open, tab]);

  /** Navigate to a search result, carrying over dates & guests. */
  function go(raw: string) {
    const [path, hash] = raw.split("#");
    const url = new URL(path, "http://safaristay.local");
    if (checkIn) url.searchParams.set("checkIn", checkIn);
    if (checkOut) url.searchParams.set("checkOut", checkOut);
    if (guests > 0) url.searchParams.set("guests", String(guests));
    setOpen(false);
    router.push(`${url.pathname}${url.search}${hash ? `#${hash}` : ""}`);
  }

  function submit() {
    if (query.trim()) {
      go(routeForQuery(query));
      return;
    }
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 0) params.set("guests", String(guests));
    setOpen(false);
    router.push(`/listings?${params.toString()}`);
  }

  const pillLabel = query.trim() || t("search.anywhere");

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <Logo className="h-9 w-9 text-brand transition-transform group-hover:scale-105" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            Safari<span className="brand-gradient">Stay</span>
          </span>
        </Link>

        <div ref={panelRef} className="relative max-w-xl flex-1">
          <button
            onClick={() => {
              setOpen(true);
              setTab("where");
            }}
            className="mx-auto flex w-full items-center gap-1 rounded-full border border-sand-300 bg-white py-2 pl-6 pr-2 shadow-sm transition hover:border-ember-500/40 hover:shadow-md"
          >
            <span className="min-w-0 truncate text-sm font-medium">{pillLabel}</span>
            <span className="mx-2 h-5 w-px shrink-0 bg-sand-200" />
            <span className="shrink-0 text-sm font-medium text-sand-700">
              {checkIn && checkOut ? `${checkIn} – ${checkOut}` : t("search.anyWeek")}
            </span>
            <span className="mx-2 h-5 w-px shrink-0 bg-sand-200" />
            <span className="shrink-0 text-sm font-medium text-sand-700">
              {guests > 0 ? `${guests} ${t("widget.guest")}${guests > 1 ? "s" : ""}` : t("search.addGuests")}
            </span>
            <span className="brand-bg ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-white">
              <SearchIcon className="h-4 w-4" />
            </span>
          </button>

          {open && (
            <div className="absolute left-1/2 top-14 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-3xl border border-sand-300 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex gap-2 text-sm">
                {([
                  ["where", t("search.tabWhere")],
                  ["when", t("search.tabWhen")],
                  ["who", t("search.tabWho")],
                ] as const).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`rounded-full px-3 py-1.5 font-semibold transition ${
                      tab === k ? "bg-ink text-white" : "bg-sand-100 text-sand-800 hover:bg-sand-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "where" && (
                <div>
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                      }}
                      placeholder={t("search.placeholder")}
                      className="w-full rounded-xl border border-sand-400 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand"
                    />
                  </div>

                  {query.trim() ? (
                    <div className="mt-3 max-h-72 overflow-y-auto">
                      {suggestions.length === 0 ? (
                        <p className="px-2 py-3 text-sm text-sand-600">{t("search.noResults")}</p>
                      ) : (
                        <ul className="space-y-1">
                          {suggestions.map((s) => (
                            <li key={s.kind + s.href}>
                              <button
                                onClick={() => go(s.href)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-sand-100"
                              >
                                <span className="text-lg">{s.emoji}</span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-semibold text-ink">{s.label}</span>
                                  <span className="block truncate text-xs text-sand-500">{s.sub}</span>
                                </span>
                                <span className="shrink-0 rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sand-500">
                                  {t(KIND_KEY[s.kind])}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-sand-500">
                        {t("search.popular")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => {
                              setQuery(c.label);
                              go(c.href);
                            }}
                            className="flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-brand hover:bg-ember-50 hover:text-brand"
                          >
                            <span>{c.emoji}</span>
                            {c.label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-sand-500">{t("search.placeholderSub")}</p>
                    </div>
                  )}
                </div>
              )}

              {tab === "when" && (
                <div className="grid grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="mb-1 block font-semibold">{t("search.checkIn")}</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-xl border border-sand-300 px-3 py-2 outline-none focus:border-brand"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-semibold">{t("search.checkOut")}</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-xl border border-sand-300 px-3 py-2 outline-none focus:border-brand"
                    />
                  </label>
                </div>
              )}

              {tab === "who" && (
                <div className="flex items-center justify-between rounded-xl border border-sand-300 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{t("search.guests")}</p>
                    <p className="text-xs text-sand-600">{t("search.guestsSub")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests((g) => Math.max(0, g - 1))}
                      className="grid h-8 w-8 place-items-center rounded-full border border-sand-400 disabled:opacity-40"
                      disabled={guests <= 0}
                    >
                      –
                    </button>
                    <span className="w-6 text-center font-semibold">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => Math.min(16, g + 1))}
                      className="grid h-8 w-8 place-items-center rounded-full border border-sand-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setQuery("");
                    setCheckIn("");
                    setCheckOut("");
                    setGuests(0);
                  }}
                  className="text-sm font-semibold underline"
                >
                  {t("search.clear")}
                </button>
                <button onClick={submit} className="brand-bg flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg">
                  <SearchIcon className="h-4 w-4" /> {t("search.search")}
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-ink/80 md:flex">
          <Link href="/listings" className="rounded-full px-3 py-2 hover:bg-sand-100">
            {t("nav.explore")}
          </Link>
          <Link href="/listings?region=Maasai+Mara" className="rounded-full px-3 py-2 hover:bg-sand-100">
            {t("nav.mara")}
          </Link>
          <Link href="/listings?q=Diani" className="rounded-full px-3 py-2 hover:bg-sand-100">
            {t("nav.diani")}
          </Link>
          <Link href="/bookings" className="rounded-full px-3 py-2 hover:bg-sand-100">
            {t("nav.bookings")}
          </Link>
          <Link
            href="/trip"
            aria-label={t("nav.trip")}
            title={t("nav.trip")}
            className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-sand-100"
          >
            <HeartIcon filled={trip.items.length > 0} className="h-5 w-5" />
            {trip.items.length > 0 && (
              <span className="brand-bg absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-white">
                {trip.items.length}
              </span>
            )}
          </Link>
          <Link href="/about" className="rounded-full px-3 py-2 hover:bg-sand-100">
            {t("nav.about")}
          </Link>
          <button
            onClick={() => setLocale(locale === "sw" ? "en" : "sw")}
            title={locale === "sw" ? t("header.en") : t("header.sw")}
            className="flex items-center gap-2 rounded-full border border-sand-300 py-2 pl-3 pr-2 transition hover:shadow-md"
          >
            <GlobeIcon className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">EN · SW</span>
            <span className="brand-bg grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white">
              {locale === "sw" ? "SW" : "EN"}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
