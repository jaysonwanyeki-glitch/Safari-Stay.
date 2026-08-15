"use client";

import { HeartIcon } from "./icons";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";

export default function WishlistButton({ id, label = false }: { id: number; label?: boolean }) {
  const liked = useWishlist(id);

  return (
    <button
      onClick={() => toggleWishlist(id)}
      aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition hover:bg-sand-100"
    >
      <HeartIcon filled={liked} className="h-5 w-5" />
      {label && <span className="underline">{liked ? "Saved" : "Save"}</span>}
    </button>
  );
}
