export type Severity = "low" | "medium" | "high" | "critical";

export function severityFromCount(count: number): Severity {
  if (count >= 10) return "critical";
  if (count >= 5) return "high";
  if (count >= 2) return "medium";
  return "low";
}

export function severityColor(sev: Severity): string {
  return {
    low: "oklch(0.72 0.16 145)",
    medium: "oklch(0.78 0.16 85)",
    high: "oklch(0.68 0.19 45)",
    critical: "oklch(0.6 0.24 27)",
  }[sev];
}
