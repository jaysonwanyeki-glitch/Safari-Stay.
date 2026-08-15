"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { ListingMarker } from "@/lib/data";

const Leaflet = dynamic(() => import("./MapView"), { ssr: false, loading: () => <MapSkeleton /> });

function MapSkeleton() {
  return <div className="h-full w-full animate-pulse bg-sky-100" />;
}

export default function ResultsMap({ markers }: { markers: ListingMarker[] }) {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Desktop sticky map */}
      <aside className="sticky top-24 hidden h-[78vh] xl:block">
        <div className="h-full w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <Leaflet points={markers} />
        </div>
      </aside>

      {/* Mobile floating toggle */}
      <button
        onClick={() => setShow(true)}
        className="brand-bg fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-2xl xl:hidden"
      >
        🗺️ Show map
      </button>

      {show && (
        <div className="fixed inset-0 z-[55] bg-white xl:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h3 className="font-bold">Map view</h3>
            <button onClick={() => setShow(false)} className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-slate-100">
              Close
            </button>
          </div>
          <div className="h-[calc(100vh-52px)] w-full">
            <Leaflet points={markers} />
          </div>
        </div>
      )}
    </>
  );
}
