import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Droplets, ThumbsUp, TrendingUp } from "lucide-react";
import { ClientOnlyMap } from "@/components/ClientOnlyMap";
import { useI18n } from "@/i18n/context";
import { useOutages } from "@/lib/outages";
import { TUNISIAN_GOVERNORATES, PROBLEM_TYPES, type ProblemType } from "@/data/tunisia-divisions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Famma Ma — Live Water Outage Map for Tunisia" },
      {
        name: "description",
        content:
          "Live crowd-sourced map of water outages across Tunisia's 24 governorates. Report, confirm, and track cuts, low pressure, contamination and leaks.",
      },
      { property: "og:title", content: "Famma Ma — Live Water Outage Map for Tunisia" },
      {
        property: "og:description",
        content: "Live crowd-sourced map of water outages across Tunisia's 24 governorates. Report, confirm, and track cuts, low pressure, contamination and leaks.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();
  const { outages, stats } = useOutages();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.home.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.home.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi
          label={t.home.activeOutages}
          value={stats.active}
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="critical"
        />
        <Kpi
          label={t.home.last24h}
          value={stats.last24}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="high"
        />
        <Kpi
          label={t.home.confirmations}
          value={stats.confirmations}
          icon={<ThumbsUp className="h-4 w-4" />}
          tone="primary"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Droplets className="h-4 w-4 text-primary" />
            {t.home.liveMap}
          </div>
          <Legend />
        </div>
        <div className="h-[420px] w-full sm:h-[520px]">
          <ClientOnlyMap outages={outages} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title={t.home.topAffected}>
          {stats.topGovs.length === 0 ? (
            <Empty label={t.home.noData} />
          ) : (
            <ul className="space-y-2.5">
              {stats.topGovs.map(([govId, count]) => {
                const gov = TUNISIAN_GOVERNORATES.find((g) => g.id === govId);
                const max = stats.topGovs[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <li key={govId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{gov?.name[lang] ?? govId}</span>
                      <span className="tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title={t.home.byProblem}>
          {stats.byProblem.length === 0 ? (
            <Empty label={t.home.noData} />
          ) : (
            <ul className="space-y-2.5">
              {stats.byProblem.map(([type, count]) => {
                const max = stats.byProblem[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <li key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {PROBLEM_TYPES[type as ProblemType][lang]}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "primary" | "critical" | "high";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    critical: "bg-destructive/10 text-destructive",
    high: "bg-[oklch(0.68_0.19_45)]/10 text-[oklch(0.55_0.19_45)]",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClass}`}>
          {icon}
        </span>
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="py-6 text-center text-sm text-muted-foreground">{label}</div>;
}

function Legend() {
  const items: [string, string][] = [
    ["oklch(0.72 0.16 145)", "1"],
    ["oklch(0.78 0.16 85)", "2+"],
    ["oklch(0.68 0.19 45)", "5+"],
    ["oklch(0.6 0.24 27)", "10+"],
  ];
  return (
    <div className="flex items-center gap-1.5">
      {items.map(([c, l]) => (
        <div key={c} className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <span
            className="inline-block h-3 w-3 rounded-full border border-white"
            style={{ background: c }}
          />
          {l}
        </div>
      ))}
    </div>
  );
}
