import { useEffect, useState } from "react";

export type Fire = {
  lat: number;
  lon: number;
  brightness: number;
  frp: number;
  confidence: string;
  acq_date: string;
  acq_time: string;
  daynight: string;
};

const REFRESH_MS = 15 * 60 * 1000; // 15 min

export function useFires(enabled: boolean) {
  const [fires, setFires] = useState<Fire[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/public/fires");
        const j = await r.json();
        if (!mounted) return;
        setFires(j.fires ?? []);
        setUpdatedAt(j.updated_at ?? null);
      } catch {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [enabled]);

  return { fires, loading, updatedAt };
}
