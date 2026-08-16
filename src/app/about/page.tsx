import type { Metadata } from "next";
import Link from "next/link";
import { PhotoStrip, RelatedLinks } from "@/components/InfoPage";
import { T } from "@/components/Localized";
import SmartImage from "@/components/SmartImage";

export const metadata: Metadata = {
  title: "About SafariStay · Our story & mission",
  description:
    "SafariStay's agenda: hiking with local communities, honest stays across Kenya, and travel that gives back. Real stays, real hosts, real trails.",
};

/** Real Kenya photography (Pexels) — same image pool as the catalogue. */
const px = (id: number, w = 1600, h = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const STEPS = [
  { emoji: "🔎", t: "about.step1t", b: "about.step1b" },
  { emoji: "🤝", t: "about.step2t", b: "about.step2b" },
  { emoji: "🥾", t: "about.step3t", b: "about.step3b" },
  { emoji: "💚", t: "about.step4t", b: "about.step4b" },
] as const;

const EXPLORES = [
  { emoji: "🦁", t: "about.explore1t", b: "about.explore1b", href: "/sites" },
  { emoji: "🚌", t: "about.explore2t", b: "about.explore2b", href: "/travel" },
  { emoji: "🎉", t: "about.explore3t", b: "about.explore3b", href: "/activities" },
] as const;

const VALUES = [
  { emoji: "🌍", t: "about.values1t", b: "about.values1b" },
  { emoji: "🤲", t: "about.values2t", b: "about.values2b" },
  { emoji: "🔥", t: "about.values3t", b: "about.values3b" },
  { emoji: "🧭", t: "about.values4t", b: "about.values4b" },
] as const;

const STATS = [
  { n: 44, u: "about.statStays" },
  { n: 28, u: "about.statCounties" },
  { n: 13, u: "about.statRegions" },
  { n: "100+", u: "about.statSites" },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">
          <T k="about.crumb" />
        </span>
      </nav>

      {/* Hero */}
      <div className="relative h-[420px] overflow-hidden rounded-3xl sm:h-[520px]">
        <SmartImage
          src={px(28157088)}
          alt="Tented camp glowing at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
            <T k="about.crumb" />
          </p>
          <h1 className="font-display max-w-3xl text-3xl font-bold text-white sm:text-5xl">
            <T k="about.title" />
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            <T k="about.sub" />
          </p>
        </div>
      </div>

      {/* The idea */}
      <div className="mx-auto mt-12 max-w-4xl">
        <h2 className="font-display text-2xl font-bold text-ink">
          <T k="about.ideaTitle" />
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-sand-800">
          <p>
            <T k="about.idea1" />
          </p>
          <p>
            <T k="about.idea2" />
          </p>
        </div>
        <PhotoStrip
          photos={[
            { id: 5306140, alt: "Golden savannah", caption: "Walk with guides who grew up on these paths." },
            { id: 20653797, alt: "Lake Victoria at sunset", caption: "Lakeside towns, island ferries, fishing villages." },
            { id: 20693413, alt: "Coastal beach", caption: "From forest trails to palm-shaded beaches." },
          ]}
        />
      </div>

      {/* Manifesto — the agenda */}
      <div className="mt-14 rounded-3xl bg-night p-8 text-sand-200 sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
          <T k="about.manifestoEyebrow" />
        </p>
        <h2 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
          <T k="about.manifestoTitle" />
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { emoji: "🥾", t: "about.manifesto1t" as const, b: "about.manifesto1b" as const },
            { emoji: "💵", t: "about.manifesto2t" as const, b: "about.manifesto2b" as const },
            { emoji: "🛡️", t: "about.manifesto3t" as const, b: "about.manifesto3b" as const },
          ].map((m) => (
            <div key={m.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl">{m.emoji}</div>
              <h3 className="mt-3 font-bold text-gold-200">
                <T k={m.t} />
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-sand-300">
                <T k={m.b} />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The SafariStay way */}
      <div className="mx-auto mt-14 max-w-4xl">
        <h2 className="font-display text-2xl font-bold text-ink">
          <T k="about.stepsTitle" />
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <span className="brand-bg grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-3 font-bold text-ink">
                <T k={s.t} />
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-sand-700">
                <T k={s.b} />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Built for explorers */}
      <div className="mx-auto mt-14 max-w-4xl">
        <h2 className="font-display text-2xl font-bold text-ink">
          <T k="about.exploreTitle" />
        </h2>
        <p className="mt-1 text-sand-600">
          <T k="about.exploreSub" />
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {EXPLORES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group rounded-2xl border border-sand-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
            >
              <div className="text-3xl">{e.emoji}</div>
              <h3 className="mt-3 font-bold text-ink group-hover:text-brand">
                <T k={e.t} />
              </h3>
              <p className="mt-1 text-sm text-sand-700">
                <T k={e.b} />
              </p>
              <p className="mt-3 text-sm font-semibold text-brand group-hover:underline">→</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mx-auto mt-14 max-w-4xl">
        <h2 className="font-display text-2xl font-bold text-ink">
          <T k="about.valuesTitle" />
        </h2>
        <p className="mt-1 text-sand-600">
          <T k="about.valuesSub" />
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.t} className="rounded-2xl border border-sand-200 bg-white/80 p-6 shadow-sm">
              <div className="text-3xl">{v.emoji}</div>
              <h3 className="mt-3 font-bold text-ink">
                <T k={v.t} />
              </h3>
              <p className="mt-1 text-sm text-sand-700">
                <T k={v.b} />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-14 rounded-3xl bg-gradient-to-br from-ember-600 to-brand-800 p-8 text-white sm:p-12">
        <h2 className="font-display text-center text-xl font-bold sm:text-2xl">
          <T k="about.statsTitle" />
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.u}>
              <dt className="text-4xl font-extrabold">{s.n}</dt>
              <dd className="mt-1 text-sm text-white/85">
                <T k={s.u} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-3xl border border-sand-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          <T k="about.ctaTitle" />
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sand-700">
          <T k="about.ctaSub" />
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/listings"
            className="brand-bg rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
          >
            <T k="about.ctaStays" />
          </Link>
          <Link
            href="/activities"
            className="rounded-full border border-sand-300 bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand hover:text-brand"
          >
            <T k="about.ctaActivities" />
          </Link>
          <Link
            href="/sites"
            className="rounded-full border border-sand-300 bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand hover:text-brand"
          >
            <T k="about.ctaSites" />
          </Link>
        </div>
      </div>

      <RelatedLinks
        links={[
          { href: "/help", label: "Help Centre", blurb: "Guides for booking, paying and travelling." },
          { href: "/safety", label: "Safety information", blurb: "How we keep guests safe at every stay." },
          { href: "/hosting", label: "Host with SafariStay", blurb: "List your stay and earn from travellers." },
        ]}
      />
    </div>
  );
}
