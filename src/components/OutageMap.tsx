import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TUNISIAN_GOVERNORATES } from "@/data/tunisia-divisions";
import { severityFromCount, severityColor } from "@/lib/severity";
import { useI18n } from "@/i18n/context";
import type { Outage } from "@/lib/outages";

export default function OutageMap({ outages }: { outages: Outage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const { lang } = useI18n();

  // Aggregate outages per governorate
  const aggregates = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of outages) {
      counts.set(o.governorate_id, (counts.get(o.governorate_id) ?? 0) + 1);
    }
    return TUNISIAN_GOVERNORATES.map((g) => ({
      gov: g,
      count: counts.get(g.id) ?? 0,
    }));
  }, [outages]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [34.5, 9.5],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const { gov, count } of aggregates) {
      const size = count === 0 ? 22 : Math.min(56, 24 + count * 4);
      const sev = severityFromCount(count);
      const color = count === 0 ? "oklch(0.75 0.02 220)" : severityColor(sev);
      const opacity = count === 0 ? 0.55 : 1;
      const icon = L.divIcon({
        className: "",
        html: `<div class="severity-marker" style="width:${size}px;height:${size}px;background:${color};opacity:${opacity}">${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([gov.latitude, gov.longitude], { icon }).addTo(layer);
      marker.bindPopup(
        `<div style="font-weight:600;font-size:13px">${gov.name[lang]}</div>
         <div style="font-size:12px;color:#666">${count} ${
           lang === "ar" ? "بلاغ" : "signalement" + (count > 1 ? "s" : "")
         }</div>`
      );
    }
  }, [aggregates, lang]);

  return <div ref={containerRef} className="h-full w-full" />;
}
