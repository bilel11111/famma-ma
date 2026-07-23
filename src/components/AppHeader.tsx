import { Link, useRouterState } from "@tanstack/react-router";
import { Droplets, Map, PlusCircle, Radio } from "lucide-react";
import { useI18n } from "@/i18n/context";

export function AppHeader() {
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItems = [
    { to: "/", label: t.nav.home, icon: Map },
    { to: "/report", label: t.nav.report, icon: PlusCircle },
    { to: "/feed", label: t.nav.feed, icon: Radio },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <Droplets className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">{t.appName}</div>
            <div className="hidden text-[11px] text-muted-foreground sm:block">{t.tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 text-xs font-semibold">
          <button
            onClick={() => setLang("fr")}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLang("ar")}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              lang === "ar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            ع
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-around border-t border-border px-2 py-1 md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-[11px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
