import Link from "next/link";
import type { ReactNode } from "react";
import SmartImage from "./SmartImage";

/** Real Kenya photography (Pexels) — same image pool as the catalogue. */
const px = (id: number, w = 1600, h = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

type InfoPageProps = {
  /** Breadcrumb label, e.g. "Help Centre". */
  crumb: string;
  title: string;
  sub: string;
  /** Pexels photo id for the hero. */
  photo: number;
  photoAlt: string;
  children: ReactNode;
};

/** Shared shell for static info pages: breadcrumb, photo hero, content. */
export default function InfoPage({ crumb, title, sub, photo, photoAlt, children }: InfoPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">{crumb}</span>
      </nav>

      <div className="relative h-[300px] overflow-hidden rounded-3xl sm:h-[400px]">
        <SmartImage src={px(photo)} alt={photoAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-black/10 p-6 sm:p-12">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">{crumb}</p>
            <h1 className="font-display max-w-2xl text-3xl font-bold text-white sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">{sub}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">{children}</div>
    </div>
  );
}

/** A titled content block. */
export function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-sand-800">{children}</div>
    </section>
  );
}

/** A row of photos with captions — used to illustrate sections. */
export function PhotoStrip({
  photos,
}: {
  photos: { id: number; alt: string; caption?: string }[];
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {photos.map((p) => (
        <figure key={p.id} className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
          <SmartImage src={px(p.id, 800, 560)} alt={p.alt} className="h-40 w-full object-cover" />
          {p.caption && (
            <figcaption className="px-3 py-2 text-xs leading-relaxed text-sand-700">{p.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/** A "related pages" card strip for cross-linking the info pages. */
export function RelatedLinks({
  links,
}: {
  links: { href: string; label: string; blurb: string }[];
}) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group rounded-2xl border border-sand-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-lg"
        >
          <p className="font-bold text-ink group-hover:text-brand">{l.label}</p>
          <p className="mt-1 text-sm text-sand-700">{l.blurb}</p>
        </Link>
      ))}
    </div>
  );
}

/** Simple styled Q&A used for FAQs. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-sand-200 bg-white p-5 shadow-sm open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink">
            {f.q}
            <span className="text-lg text-brand transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-sand-800">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
