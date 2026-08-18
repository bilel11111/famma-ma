import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/context";
import { getDeviceId } from "@/lib/device";
import {
  TUNISIAN_GOVERNORATES,
  PROBLEM_TYPES,
  getGovernorateById,
  type ProblemType,
} from "@/data/tunisia-divisions";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Water Outage — Famma Ma" },
      {
        name: "description",
        content:
          "Report a water cut, low pressure, contamination or leak in your delegation. Anonymous, takes 15 seconds.",
      },
      { property: "og:title", content: "Report a Water Outage — Famma Ma" },
      {
        property: "og:description",
        content: "Report water outages in Tunisia anonymously in seconds.",
      },
      { property: "og:url", content: "https://github.com/bilel11111/famma-ma/report" },
      { property: "og:type", content: "website" },
      {
        name: "keywords",
        content:
          "signaler coupure eau Tunisie, الإبلاغ عن انقطاع الماء, SONEDE réclamation, الصوناد شكوى, fuite eau, eau contaminée",
      },
    ],
    links: [{ rel: "canonical", href: "https://github.com/bilel11111/famma-ma/report" }],
  }),
  component: ReportPage,
});

type Timing = "now" | "1h" | "6h" | "24h" | "older";

function ReportPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [gov, setGov] = useState("");
  const [del, setDel] = useState("");
  const [problem, setProblem] = useState<ProblemType | "">("");
  const [description, setDescription] = useState("");
  const [timing, setTiming] = useState<Timing>("now");
  const [submitting, setSubmitting] = useState(false);

  const delegations = useMemo(() => getGovernorateById(gov)?.delegations ?? [], [gov]);

  const timingOptions: { id: Timing; label: string }[] = [
    { id: "now", label: lang === "ar" ? "الآن" : "Maintenant" },
    { id: "1h", label: lang === "ar" ? "منذ ساعة" : "Il y a 1h" },
    { id: "6h", label: lang === "ar" ? "منذ 6 س" : "Il y a 6h" },
    { id: "24h", label: lang === "ar" ? "منذ يوم" : "Il y a 24h" },
    { id: "older", label: lang === "ar" ? "أقدم" : "Plus ancien" },
  ];

  const timingToDate = (id: Timing): Date => {
    const map: Record<Timing, number> = { now: 0, "1h": 1, "6h": 6, "24h": 24, older: 72 };
    return new Date(Date.now() - map[id] * 60 * 60 * 1000);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gov || !del || !problem) {
      toast.error(t.report.required);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("outages").insert({
      governorate_id: gov,
      delegation_id: del,
      problem_type: problem,
      description: description.trim() || null,
      start_time: timingToDate(timing).toISOString(),
      reporter_device: getDeviceId(),
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t.report.success, { icon: <Check className="h-4 w-4" /> });
    navigate({ to: "/feed" });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t.report.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.report.subtitle}</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-card"
      >
        <Field label={t.report.governorate}>
          <select
            value={gov}
            onChange={(e) => {
              setGov(e.target.value);
              setDel("");
            }}
            className="input"
            required
          >
            <option value="">{t.report.selectGov}</option>
            {TUNISIAN_GOVERNORATES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name[lang]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.report.delegation}>
          <select
            value={del}
            onChange={(e) => setDel(e.target.value)}
            className="input"
            disabled={!gov}
            required
          >
            <option value="">{t.report.selectDel}</option>
            {delegations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name[lang]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.report.problem}>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PROBLEM_TYPES) as ProblemType[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setProblem(p)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  problem === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {PROBLEM_TYPES[p][lang]}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t.report.startTime}>
          <div className="flex flex-wrap gap-1.5">
            {timingOptions.map((o) => (
              <button
                type="button"
                key={o.id}
                onClick={() => setTiming(o.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  timing === o.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t.report.description}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.report.descPlaceholder}
            className="input min-h-[80px] resize-y"
            maxLength={500}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.report.submitting}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t.report.submit}
            </>
          )}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: var(--color-ring);
          box-shadow: 0 0 0 3px oklch(0.55 0.16 230 / 0.15);
        }
        .input:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
