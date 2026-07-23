import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Outage = Database["public"]["Tables"]["outages"]["Row"];

export function useOutages() {
  const [outages, setOutages] = useState<Outage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("outages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (!mounted) return;
        setOutages(data ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel("outages-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "outages" },
        (payload) => {
          setOutages((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Outage;
              if (prev.some((o) => o.id === row.id)) return prev;
              return [row, ...prev].slice(0, 200);
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Outage;
              return prev.map((o) => (o.id === row.id ? row : o));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as Outage;
              return prev.filter((o) => o.id !== row.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const last24 = outages.filter((o) => now - new Date(o.created_at).getTime() < dayMs);
    const byGov = new Map<string, number>();
    const byType = new Map<string, number>();
    let confirmations = 0;
    for (const o of outages) {
      byGov.set(o.governorate_id, (byGov.get(o.governorate_id) ?? 0) + 1);
      byType.set(o.problem_type, (byType.get(o.problem_type) ?? 0) + 1);
      confirmations += o.confirmations_count;
    }
    const topGovs = [...byGov.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const byProblem = [...byType.entries()].sort((a, b) => b[1] - a[1]);
    return {
      active: outages.length,
      last24: last24.length,
      confirmations,
      topGovs,
      byProblem,
    };
  }, [outages]);

  return { outages, loading, stats };
}

export function useUserConfirmations(deviceId: string) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!deviceId) return;
    let mounted = true;
    supabase
      .from("confirmations")
      .select("outage_id")
      .eq("device_id", deviceId)
      .then(({ data }) => {
        if (!mounted) return;
        setIds(new Set((data ?? []).map((r) => r.outage_id)));
      });
    return () => {
      mounted = false;
    };
  }, [deviceId]);

  const toggle = async (outageId: string) => {
    if (!deviceId) return;
    const has = ids.has(outageId);
    // optimistic
    setIds((s) => {
      const n = new Set(s);
      has ? n.delete(outageId) : n.add(outageId);
      return n;
    });
    if (has) {
      await supabase
        .from("confirmations")
        .delete()
        .eq("outage_id", outageId)
        .eq("device_id", deviceId);
    } else {
      await supabase.from("confirmations").insert({ outage_id: outageId, device_id: deviceId });
    }
  };

  return { confirmedIds: ids, toggle };
}
