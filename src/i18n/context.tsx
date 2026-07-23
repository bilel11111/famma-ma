import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang } from "./translations";

type T = (typeof translations)["fr"];
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "fr" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  return (
    <I18nContext.Provider
      value={{ lang, setLang, t: translations[lang], dir: lang === "ar" ? "rtl" : "ltr" }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTimeAgo() {
  const { t } = useI18n();
  return (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    if (s < 60) return t.feed.ago.now;
    if (s < 3600) return t.feed.ago.min(Math.floor(s / 60));
    if (s < 86400) return t.feed.ago.hour(Math.floor(s / 3600));
    return t.feed.ago.day(Math.floor(s / 86400));
  };
}
