"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { PublicListing } from "@/lib/data";
import { PRICE_TIERS, placeLabel } from "@/lib/constants";
import { formatKes } from "@/lib/format";
import SmartImage from "./SmartImage";
import { HeartIcon, StarIcon } from "./icons";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";

const TIER_ICON: Record<string, string> = {
  budget: "💸",
  mid: "💰",
  luxury: "👑",
};

export default function ListingCard({ listing }: { listing: PublicListing }) {
  const [index, setIndex] = useState(0);
  const liked = useWishlist(listing.id);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = listing.imageUrls.length;

  function start() {
    if (total <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % total), 1800);
  }
  function stop() {
    if (timer.current) clearInterval(timer.current);
    setIndex(0);
  }

  function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(listing.id);
  }

  const tier = PRICE_TIERS.find((t) => t.key === listing.priceTier);
  const place = placeLabel(listing.roomType, listing.propertyType);

  return (
    <Link href={`/listings/${listing.slug}`} className="group block">
      <div
        className="card-zoom relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
        onMouseEnter={start}
        onMouseLeave={stop}
      >
        {listing.imageUrls.map((url, i) => (
          <SmartImage
            key={url + i}
            src={url}
            alt={`${listing.title} — photo ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {listing.superhost && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow">
            Superhost
          </span>
        )}

        {tier && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow">
            {TIER_ICON[tier.key] ?? "🏷️"} {tier.label}
          </span>
        )}

        <button
          onClick={toggleLike}
          aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 transition-transform hover:scale-110 active:scale-95"
        >
          <HeartIcon filled={liked} className="h-7 w-7 drop-shadow" />
        </button>

        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {Array.from({ length: Math.min(total, 6) }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full bg-white transition-opacity ${
                  i === index ? "opacity-100" : "opacity-60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-ink">{listing.locationName}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm">
            <StarIcon className="h-3.5 w-3.5" />
            {listing.rating.toFixed(2)}
          </span>
        </div>
        <p className="truncate text-sm text-slate-500">{listing.title}</p>
        <p className="truncate text-sm capitalize text-slate-500">
          {place} · {listing.county ?? listing.region}
        </p>
        {listing.landmark && (
          <p className="truncate text-sm font-semibold text-brand">📍 Near {listing.landmark}</p>
        )}
        <p className="truncate text-sm text-slate-500">
          {listing.bedrooms} bed{listing.bedrooms > 1 ? "s" : ""} · {listing.bathrooms} bath
          {listing.bathrooms > 1 ? "s" : ""}
        </p>
        <p className="mt-1.5 text-sm">
          <span className="font-bold text-ink">{formatKes(listing.pricePerNight)}</span>{" "}
          <span className="text-slate-600">night</span>
        </p>
      </div>
    </Link>
  );
}
