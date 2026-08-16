"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { stageAnchor, type MajorStage } from "@/lib/travel";

type Props = {
  stages: MajorStage[];
};

export default function StageMapView({ stages }: Props) {
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

  // Render markers and frame the country whenever stages change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || stages.length === 0) return;

    layer.clearLayers();
    const latlngs: [number, number][] = [];

    for (const s of stages) {
      const html = `<div class="grid h-8 w-8 place-items-center rounded-full bg-white text-base shadow-md border border-sand-300">🚌</div>`;
      const icon = L.divIcon({ html, className: "safari-marker", iconSize: [32, 32], iconAnchor: [16, 32] });
      const marker = L.marker([s.coords.lat, s.coords.lng], { icon }).addTo(layer);
      marker.bindTooltip(`<strong>${s.town}</strong><br/>${s.stage}`, { direction: "top", offset: [0, -14] });
      marker.on("click", () => {
        window.location.hash = stageAnchor(s.town);
        const el = document.getElementById(stageAnchor(s.town));
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      latlngs.push([s.coords.lat, s.coords.lng]);
    }

    map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 7 });
  }, [stages]);

  return <div ref={containerRef} className="h-full w-full" />;
}
