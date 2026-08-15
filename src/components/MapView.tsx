"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ListingMarker } from "@/lib/data";
import { formatKesShort } from "@/lib/format";

type Props = {
  points: ListingMarker[];
  selectedId?: number;
  className?: string;
};

export default function MapView({ points, selectedId, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Initialise the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      attributionControl: true,
    });
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Render markers and frame the view whenever points change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || points.length === 0) return;

    layer.clearLayers();
    const latlngs: [number, number][] = [];

    for (const p of points) {
      const isSel = p.id === selectedId;
      const html = isSel
        ? `<div style="background-image:linear-gradient(90deg,#e61e4d,#d70466)" class="grid h-10 w-10 place-items-center rounded-full text-base shadow-xl ring-2 ring-white">📍</div>`
        : `<div class="px-2.5 py-1 rounded-full bg-white text-[11px] font-bold shadow-md border border-slate-200 hover:scale-110 transition">${formatKesShort(
            p.pricePerNight,
          )}</div>`;
      const icon = L.divIcon({
        html,
        className: "safari-marker",
        iconSize: isSel ? [40, 40] : [64, 26],
        iconAnchor: isSel ? [20, 40] : [32, 13],
      });
      const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(layer);
      marker.bindTooltip(p.title, { direction: "top", offset: [0, -10] });
      marker.on("click", () => {
        window.location.assign(`/listings/${p.slug}`);
      });
      latlngs.push([p.latitude, p.longitude]);
    }

    if (latlngs.length === 1) {
      map.setView(latlngs[0], 11);
    } else {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50], maxZoom: 12 });
    }
  }, [points, selectedId]);

  return <div ref={containerRef} className={`h-full w-full ${className}`} />;
}
