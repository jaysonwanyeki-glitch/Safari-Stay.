"use client";

import dynamic from "next/dynamic";
import type { MajorStage } from "@/lib/travel";

const Leaflet = dynamic(() => import("./StageMapView"), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse rounded-2xl bg-sand-200" />,
});

export default function StageMap({ stages }: { stages: MajorStage[] }) {
  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl border border-sand-200 shadow-sm sm:h-96">
      <Leaflet stages={stages} />
    </div>
  );
}
