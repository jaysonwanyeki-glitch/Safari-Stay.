"use client";

import { HeartIcon } from "./icons";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";
import { useT } from "./Localized";

export default function WishlistButton({ id, label = false }: { id: number; label?: boolean }) {
  const liked = useWishlist(id);
  const t = useT();

  return (
    <button
      onClick={() => toggleWishlist(id)}
      aria-label={liked ? t("wishlist.remove") : t("wishlist.add")}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition hover:bg-sand-100"
    >
      <HeartIcon filled={liked} className="h-5 w-5" />
      {label && <span className="underline">{liked ? t("wishlist.saved") : t("wishlist.save")}</span>}
    </button>
  );
}
