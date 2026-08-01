import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TUNISIAN_GOVERNORATES } from "@/data/tunisia-divisions";
import { severityFromCount, severityColor } from "@/lib/severity";
import { useI18n } from "@/i18n/context";
import type { Outage } from "@/lib/outages";
import type { Fire } from "@/lib/fires";

export default function OutageMap({
  outages,
  fires = [],
  showFires = true,
  showNews = true,
}: {
  outages: Outage[];
  fires?: Fire[];
  showFires?: boolean;
  showNews?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const firesLayerRef = useRef<L.LayerGroup | null>(null);
  const newsLayerRef = useRef<L.LayerGroup | null>(null);
  const { lang } = useI18n();

  const newsItems = useMemo(() => outages.filter((o) => !!o.source_url), [outages]);

  const aggregates = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of outages) {
      if (o.source_url) continue;
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
      center: [34.2, 9.6],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: true,
      minZoom: 5,
      maxBounds: L.latLngBounds([29.5, 6.5], [38.5, 13.5]),
      maxBoundsViscosity: 0.7,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap &middot; CARTO &middot; Fires: NASA FIRMS",
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    firesLayerRef.current = L.layerGroup().addTo(map);
    newsLayerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      firesLayerRef.current = null;
      newsLayerRef.current = null;
    };
  }, []);

  // Outage markers
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const { gov, count } of aggregates) {
      const size = count === 0 ? 20 : Math.min(58, 26 + count * 4);
      const sev = severityFromCount(count);
      const color = count === 0 ? "oklch(0.75 0.02 220)" : severityColor(sev);
      const opacity = count === 0 ? 0.55 : 1;
      const icon = L.divIcon({
        className: "",
        html: `<div class="severity-marker${count >= 5 ? " severity-marker--hot" : ""}" style="width:${size}px;height:${size}px;background:${color};opacity:${opacity}">${count === 0 ? "" : count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([gov.latitude, gov.longitude], { icon }).addTo(layer);
      marker.bindPopup(
        `<div class="map-pop" dir="${lang === "ar" ? "rtl" : "ltr"}">
           <div class="map-pop__title">${gov.name[lang]}</div>
           <div class="map-pop__meta">${count} ${
             lang === "ar" ? "بلاغ" : "signalement" + (count > 1 ? "s" : "")
           }</div>
         </div>`
      );
    }
  }, [aggregates, lang]);

  // Fire markers
  useEffect(() => {
    const map = mapRef.current;
    const layer = firesLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (!showFires) {
      if (map.hasLayer(layer)) map.removeLayer(layer);
      return;
    }
    if (!map.hasLayer(layer)) map.addLayer(layer);
    for (const f of fires) {
      const size = Math.max(8, Math.min(20, 8 + Math.log2(1 + f.frp) * 2));
      const icon = L.divIcon({
        className: "",
        html: `<div class="fire-marker" style="width:${size}px;height:${size}px"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([f.lat, f.lon], { icon }).addTo(layer);
      const label = lang === "ar" ? "حريق نشط" : "Feu actif";
      const conf = lang === "ar" ? "الثقة" : "Confiance";
      const power = lang === "ar" ? "الطاقة" : "Puissance";
      marker.bindPopup(
        `<div class="map-pop" dir="${lang === "ar" ? "rtl" : "ltr"}">
           <div class="map-pop__title map-pop__title--fire">🔥 ${label}</div>
           <div class="map-pop__meta">${f.acq_date} ${f.acq_time}</div>
           <div class="map-pop__meta">${power}: ${f.frp.toFixed(1)} MW · ${conf}: ${f.confidence}</div>
         </div>`
      );
    }
  }, [fires, showFires, lang]);

  return <div ref={containerRef} className="h-full w-full" />;
}
