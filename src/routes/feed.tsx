import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Droplet, Filter, ThumbsUp } from "lucide-react";
import { useI18n, useTimeAgo } from "@/i18n/context";
import { useOutages, useUserConfirmations, type Outage } from "@/lib/outages";
import { getDeviceId } from "@/lib/device";
import {
  PROBLEM_TYPES,
  getDelegationById,
  getGovernorateById,
  type ProblemType,
} from "@/data/tunisia-divisions";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Live Feed — Famma Ma" },
      {
        name: "description",
        content:
          "Live feed of water outage reports across Tunisia. Confirm reports in your area to help others.",
      },
      { property: "og:title", content: "Live Feed — Famma Ma" },
      {
        property: "og:description",
        content: "Live water outage reports from every governorate in Tunisia.",
      },
      { property: "og:url", content: "https://github.com/bilel11111/famma-ma/feed" },
      { property: "og:type", content: "website" },
      {
        name: "keywords",
        content:
          "flux coupures eau Tunisie, بلاغات انقطاع الماء, SONEDE actualité, signalement eau, الصوناد",
      },
    ],
    links: [{ rel: "canonical", href: "https://github.com/bilel11111/famma-ma/feed" }],
  }),
  component: FeedPage,
});

function FeedPage() {
  const { t, lang } = useI18n();
  const timeAgo = useTimeAgo();
  const { outages } = useOutages();
  const [deviceId, setDeviceId] = useState("");
  useEffect(() => setDeviceId(getDeviceId()), []);
  const { confirmedIds, toggle } = useUserConfirmations(deviceId);
  const [filter, setFilter] = useState<ProblemType | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? outages : outages.filter((o) => o.problem_type === filter)),
    [outages, filter]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">{t.feed.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.feed.subtitle}</p>
      </header>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
        </div>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {t.feed.filterAll}
        </FilterChip>
        {(Object.keys(PROBLEM_TYPES) as ProblemType[]).map((p) => (
          <FilterChip key={p} active={filter === p} onClick={() => setFilter(p)}>
            {PROBLEM_TYPES[p][lang]}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Droplet className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t.feed.empty}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((o) => (
            <FeedItem
              key={o.id}
              outage={o}
              confirmed={confirmedIds.has(o.id)}
              onToggle={() => toggle(o.id)}
              timeAgo={timeAgo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

const PROBLEM_TONE: Record<ProblemType, string> = {
  water_cut: "bg-destructive/10 text-destructive",
  low_pressure: "bg-[oklch(0.78_0.16_85)]/15 text-[oklch(0.52_0.16_85)]",
  contamination: "bg-[oklch(0.65_0.2_310)]/15 text-[oklch(0.5_0.2_310)]",
  leak: "bg-primary/10 text-primary",
};

function FeedItem({
  outage,
  confirmed,
  onToggle,
  timeAgo,
}: {
  outage: Outage;
  confirmed: boolean;
  onToggle: () => void;
  timeAgo: (d: Date | string) => string;
}) {
  const { t, lang } = useI18n();
  const gov = getGovernorateById(outage.governorate_id);
  const del = getDelegationById(outage.governorate_id, outage.delegation_id);
  const type = outage.problem_type as ProblemType;
  const desc =
    lang === "ar" ? outage.description_ar || outage.description : outage.description;

  return (
    <li className="rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${PROBLEM_TONE[type]}`}
            >
              {PROBLEM_TYPES[type][lang]}
            </span>
            <span className="text-[11px] text-muted-foreground">{timeAgo(outage.created_at)}</span>
          </div>
          <div className="mt-1.5 truncate text-sm font-semibold">
            {del?.name[lang] ?? outage.delegation_id}
            <span className="ms-1.5 font-normal text-muted-foreground">
              · {gov?.name[lang] ?? outage.governorate_id}
            </span>
          </div>
          {desc && (
            <p className="mt-1.5 text-sm text-muted-foreground" dir={lang === "ar" ? "rtl" : "ltr"}>
              {desc}
            </p>
          )}
          {outage.source_url && (
            <a
              href={outage.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-[11px] font-medium text-primary hover:underline"
            >
              {lang === "ar" ? "المصدر: مقال صحفي ↗" : "Source : article de presse ↗"}
            </a>
          )}
        </div>

        <button
          onClick={onToggle}
          className={`flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
            confirmed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {confirmed ? <Check className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
          <span className="tabular-nums">{outage.confirmations_count}</span>
          <span className="text-[10px] font-normal opacity-80">
            {confirmed ? t.feed.confirmed : t.feed.confirm}
          </span>
        </button>
      </div>
    </li>
  );
}
