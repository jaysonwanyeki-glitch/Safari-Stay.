"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { REGIONS } from "@/lib/constants";
import { GlobeIcon, MenuIcon, SearchIcon } from "./icons";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"where" | "when" | "who">("where");
  const [region, setRegion] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

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
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="brand-bg grid h-9 w-9 place-items-center rounded-xl text-lg shadow-sm">
            🦁
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            safari<span className="brand-gradient">stay</span>
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
            <span className="text-sm font-medium">{region || "Anywhere"}</span>
            <span className="mx-2 h-5 w-px bg-sand-200" />
            <span className="text-sm font-medium text-sand-700">
              {checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Any week"}
            </span>
            <span className="mx-2 h-5 w-px bg-sand-200" />
            <span className="text-sm font-medium text-sand-700">
              {guests > 0 ? `${guests} guest${guests > 1 ? "s" : ""}` : "Add guests"}
            </span>
            <span className="brand-bg ml-auto grid h-8 w-8 place-items-center rounded-full text-white">
              <SearchIcon className="h-4 w-4" />
            </span>
          </button>

          {open && (
            <div className="absolute left-1/2 top-14 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-3xl border border-sand-300 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex gap-2 text-sm">
                {([["where", "Where"], ["when", "When"], ["who", "Who"]] as const).map(([k, label]) => (
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
                    🌍 Anywhere in Kenya
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
                    <span className="mb-1 block font-semibold">Check in</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-xl border border-sand-300 px-3 py-2 outline-none focus:border-brand"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-semibold">Check out</span>
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
                    <p className="text-sm font-semibold">Guests</p>
                    <p className="text-xs text-sand-600">Adults, children & infants</p>
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
                  Clear all
                </button>
                <button onClick={submit} className="brand-bg flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg">
                  <SearchIcon className="h-4 w-4" /> Search
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-ink/80 md:flex">
          <Link href="/listings" className="rounded-full px-3 py-2 hover:bg-sand-100">
            Explore stays
          </Link>
          <Link href="/listings?region=Maasai+Mara" className="rounded-full px-3 py-2 hover:bg-sand-100">
            Maasai Mara
          </Link>
          <Link href="/listings?q=Diani" className="rounded-full px-3 py-2 hover:bg-sand-100">
            Diani Beach
          </Link>
          <button className="flex items-center gap-2 rounded-full border border-sand-300 py-2 pl-3 pr-1 hover:shadow-md">
            <GlobeIcon className="h-4 w-4" />
            <MenuIcon className="h-4 w-4" />
            <span className="brand-bg grid h-7 w-7 place-items-center rounded-full text-xs text-white">A</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
