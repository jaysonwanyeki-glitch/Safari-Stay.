import Link from "next/link";
import { REGIONS } from "@/lib/constants";
import { T } from "./Localized";
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
            <p className="text-xs text-sand-400">
              <T k="footer.taglineSmall" />
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">
            <T k="footer.support" />
          </h4>
          <ul className="space-y-2 text-sm text-sand-300">
            <li>
              <Link href="/about" className="transition hover:text-white hover:underline">
                <T k="footer.about" />
              </Link>
            </li>
            <li>
              <Link href="/bookings" className="transition hover:text-white hover:underline">
                <T k="nav.bookings" />
              </Link>
            </li>
            <li>
              <Link href="/help" className="transition hover:text-white hover:underline">
                <T k="footer.help" />
              </Link>
            </li>
            <li>
              <Link href="/safety" className="transition hover:text-white hover:underline">
                <T k="footer.safety" />
              </Link>
            </li>
            <li>
              <Link href="/cancellations" className="transition hover:text-white hover:underline">
                <T k="footer.cancelOpts" />
              </Link>
            </li>
            <li>
              <Link href="/report" className="transition hover:text-white hover:underline">
                <T k="footer.report" />
              </Link>
            </li>
            <li>
              <Link href="/travel" className="transition hover:text-white hover:underline">
                <T k="footer.travel" />
              </Link>
            </li>
            <li>
              <Link href="/sites" className="transition hover:text-white hover:underline">
                <T k="footer.sites" />
              </Link>
            </li>
            <li>
              <Link href="/activities" className="transition hover:text-white hover:underline">
                <T k="footer.activities" />
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">
            <T k="footer.regions" />
          </h4>
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
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">
            <T k="footer.hosting" />
          </h4>
          <ul className="space-y-2 text-sm text-sand-300">
            <li>
              <Link href="/hosting" className="transition hover:text-white hover:underline">
                <T k="footer.hosting1" />
              </Link>
            </li>
            <li>
              <Link href="/hosting#resources" className="transition hover:text-white hover:underline">
                <T k="footer.hosting2" />
              </Link>
            </li>
            <li>
              <Link href="/hosting#community" className="transition hover:text-white hover:underline">
                <T k="footer.hosting3" />
              </Link>
            </li>
            <li>
              <Link href="/hosting#responsible" className="transition hover:text-white hover:underline">
                <T k="footer.hosting4" />
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-300">SafariStay Kenya</h4>
          <p className="text-sm leading-relaxed text-sand-300">
            <T k="footer.tagline" />
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-sand-400 sm:flex-row">
          <p>
            <T k="footer.copyright" vars={{ year }} />
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link href="/terms" className="transition hover:text-white hover:underline">
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link href="/privacy" className="transition hover:text-white hover:underline">
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <span>Properties are real &amp; rates are published seasonal rates</span>
            <span aria-hidden>·</span>
            <span>Photos © Pexels · Weather © Open-Meteo · FX © ExchangeRate-API · Maps © OpenStreetMap</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
