"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { REGIONS } from "@/lib/constants";
import { useLocale, setLocale, readLocale } from "@/lib/locale";
import { useT } from "./Localized";
import { GlobeIcon, SearchIcon } from "./icons";
import Logo from "./Logo";

export default function Header() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"where" | "when" | "who">("where");
  const [region, setRegion] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

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

  function submit() {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 0) params.set("guests", String(guests));
    setOpen(false);
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <Logo className="h-9 w-9 text-brand transition-transform group-hover:scale-105" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            Safari<span className="brand-gradient">Stay</span>
          </span>
        </Link>

        <div ref={panelRef} className="relative flex-1 max-w-xl">
          <button
            onClick={() => {
              setOpen(true);
              setTab("where");
            }}
            className="mx-auto flex w-full items-center gap-1 rounded-full border border-sand-300 bg-white py-2 pl-6 pr-2 shadow-sm transition hover:border-ember-500/40 hover:shadow-md"
          >
            <span className="text-sm font-medium">{region || t("search.anywhere")}</span>
            <span className="mx-2 h-5 w-px bg-sand-200" />
            <span className="text-sm font-medium text-sand-700">
              {checkIn && checkOut ? `${checkIn} – ${checkOut}` : t("search.anyWeek")}
            </span>
            <span className="mx-2 h-5 w-px bg-sand-200" />
            <span className="text-sm font-medium text-sand-700">
              {guests > 0 ? `${guests} ${t("widget.guest")}${guests > 1 ? "s" : ""}` : t("search.addGuests")}
            </span>
            <span className="brand-bg ml-auto grid h-8 w-8 place-items-center rounded-full text-white">
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
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRegion("")}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${
                      region === "" ? "border-brand bg-ember-50" : "border-sand-300 hover:border-brand"
                    }`}
                  >
                    🌍 {t("search.anywhereKenya")}
                  </button>
                  {REGIONS.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setRegion(r.name)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm ${
                        region === r.name ? "border-brand bg-ember-50" : "border-sand-300 hover:border-brand"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
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
                    setRegion("");
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
