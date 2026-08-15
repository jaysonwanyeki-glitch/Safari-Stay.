import Link from "next/link";
import { REGIONS } from "@/lib/constants";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t-4 border-ember-600/80 bg-night text-sand-200">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-6 py-6">
          <Logo className="h-9 w-9 text-gold-300" />
          <div>
            <p className="font-display text-lg font-bold leading-tight text-sand-50">
              Safari<span className="text-gold-300">Stay</span>
            </p>
            <p className="text-xs text-sand-400">Real stays. Real rates. Real Kenya seasons.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">Support</h4>
          <ul className="space-y-2 text-sm text-sand-300">
            <li>
              <Link href="/bookings" className="transition hover:text-white hover:underline">
                My bookings
              </Link>
            </li>
            <li>Help Centre</li>
            <li>Safety information</li>
            <li>Cancellation options</li>
            <li>Report a concern</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">Top regions</h4>
          <ul className="space-y-2 text-sm text-sand-300">
            {REGIONS.slice(0, 5).map((r) => (
              <li key={r.name}>
                <Link href={`/listings?region=${encodeURIComponent(r.name)}`} className="transition hover:text-white hover:underline">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">Hosting</h4>
          <ul className="space-y-2 text-sm text-sand-300">
            <li>List your home or camp</li>
            <li>Host resources</li>
            <li>Community tourism</li>
            <li>Responsible travel</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">SafariStay Kenya</h4>
          <p className="text-sm leading-relaxed text-sand-300">
            Hand-picked homes, villas and hosted camps beside Kenya&apos;s world-famous wildlife reserves — from the
            golden plains of the Mara to the palm-shaded coast.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-sand-400 sm:flex-row">
          <p>© {year} SafariStay — demo marketplace for the Kenyan safari market.</p>
          <p>
            Properties are real &amp; rates are published seasonal rates · Photography via Pexels · Weather © Open-Meteo · FX ©
            ExchangeRate-API · Maps © OpenStreetMap contributors
          </p>
        </div>
      </div>
    </footer>
  );
}
