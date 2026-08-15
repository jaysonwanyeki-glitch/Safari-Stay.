import Link from "next/link";
import { REGIONS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-fog">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-sm font-bold">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Help Centre</li>
            <li>Safety information</li>
            <li>Cancellation options</li>
            <li>Report a concern</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Top regions</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            {REGIONS.slice(0, 5).map((r) => (
              <li key={r.name}>
                <Link href={`/listings?region=${encodeURIComponent(r.name)}`} className="hover:underline">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Hosting</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>List your home or camp</li>
            <li>Host resources</li>
            <li>Community tourism</li>
            <li>Responsible travel</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">SafariStay Kenya</h4>
          <p className="text-sm text-slate-600">
            Hand-picked homes, villas and hosted camps beside Kenya&apos;s world-famous wildlife reserves.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
          <p>© {year} SafariStay — demo marketplace for the Kenyan safari market.</p>
          <p>
            Stays are illustrative. Photography via Pexels contributors · Maps © OpenStreetMap contributors
          </p>
        </div>
      </div>
    </footer>
  );
}
