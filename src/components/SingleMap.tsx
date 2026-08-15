"use client";

import dynamic from "next/dynamic";
import type { ListingMarker } from "@/lib/data";

const Leaflet = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div className="h-80 w-full animate-pulse rounded-2xl bg-sand-200" /> });

export default function SingleMap({ point }: { point: ListingMarker }) {
  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl border border-sand-200">
      <Leaflet points={[point]} selectedId={point.id} />
    </div>
  );
}
