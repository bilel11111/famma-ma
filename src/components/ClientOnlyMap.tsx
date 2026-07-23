import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import type { Outage } from "@/lib/outages";

const MapClient = lazy(() => import("./OutageMap")) as unknown as ComponentType<{
  outages: Outage[];
}>;

export function ClientOnlyMap({ outages }: { outages: Outage[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
        …
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          …
        </div>
      }
    >
      <MapClient outages={outages} />
    </Suspense>
  );
}
