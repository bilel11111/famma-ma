import { createFileRoute } from "@tanstack/react-router";

// NASA FIRMS active-fire proxy for Tunisia.
// Docs: https://firms.modaps.eosdis.nasa.gov/api/area/
// Source: VIIRS_SNPP_NRT (near-real-time, ~3h latency).
// Tunisia bbox (W,S,E,N): 7,30,12,38

type Fire = {
  lat: number;
  lon: number;
  brightness: number;
  frp: number;
  confidence: string;
  acq_date: string;
  acq_time: string;
  daynight: string;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/fires")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        const key = process.env.NASA_FIRMS_MAP_KEY;
        if (!key) {
          return new Response(
            JSON.stringify({ error: "NASA_FIRMS_MAP_KEY not configured" }),
            { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
          );
        }

        const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_NRT/7,30,12,38/1`;
        try {
          const res = await fetch(url);
          if (!res.ok) {
            return new Response(
              JSON.stringify({ error: `NASA FIRMS ${res.status}` }),
              { status: 502, headers: { "Content-Type": "application/json", ...CORS } }
            );
          }
          const csv = await res.text();
          const fires = parseCsv(csv);
          return new Response(JSON.stringify({ fires, updated_at: new Date().toISOString() }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=900", // 15 min
              ...CORS,
            },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: (e as Error).message }),
            { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
          );
        }
      },
    },
  },
});

function parseCsv(csv: string): Fire[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);
  const iLat = idx("latitude");
  const iLon = idx("longitude");
  const iBri = idx("bright_ti4");
  const iFrp = idx("frp");
  const iConf = idx("confidence");
  const iDate = idx("acq_date");
  const iTime = idx("acq_time");
  const iDN = idx("daynight");

  const out: Fire[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(",");
    const lat = parseFloat(c[iLat]);
    const lon = parseFloat(c[iLon]);
    if (!isFinite(lat) || !isFinite(lon)) continue;
    out.push({
      lat,
      lon,
      brightness: parseFloat(c[iBri]) || 0,
      frp: parseFloat(c[iFrp]) || 0,
      confidence: c[iConf] ?? "",
      acq_date: c[iDate] ?? "",
      acq_time: c[iTime] ?? "",
      daynight: c[iDN] ?? "",
    });
  }
  return out;
}
