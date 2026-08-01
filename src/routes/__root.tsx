import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { I18nProvider } from "@/i18n/context";
import { AppHeader } from "@/components/AppHeader";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
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
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Famma Ma" },
      { property: "og:locale", content: "ar_TN" },
      { property: "og:locale:alternate", content: "fr_TN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Famma Ma — Live Water Outage Map for Tunisia" },
      { name: "twitter:description", content: "Live crowd-sourced map of water outages across Tunisia's 24 governorates. Report, confirm, and track cuts, low pressure, contamination and leaks." },
      {
        name: "keywords",
        content:
          "coupure eau Tunisie, انقطاع الماء تونس, SONEDE, الصوناد, coupure SONEDE aujourd'hui, carte coupure eau, water outage Tunisia, feux Tunisie, حرائق تونس, NASA FIRMS Tunisie, pression eau, eau contaminée, fuite eau Tunis, Sfax, Sousse, Nabeul",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Famma Ma" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2f1a33af-bbf4-47f6-ba3b-a48e06e32328" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2f1a33af-bbf4-47f6-ba3b-a48e06e32328" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Cairo:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Famma Ma",
          alternateName: "فمّا ماء",
          url: "https://famma-ma.lovable.app",
          inLanguage: ["ar", "fr"],
          description:
            "Carte en temps réel des coupures d'eau en Tunisie et des feux actifs NASA FIRMS.",
        }),
      },
      { src: "https://pl30575722.effectivecpmnetwork.com/6a/bc/ad/6abcad93c87f733645d3e7ddcf495acc.js" },
      { src: "https://pl30575723.effectivecpmnetwork.com/e7/86/b4/e786b4060919739e2a392898c4423572.js" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <AppHeader />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-center" richColors />
      </I18nProvider>
    </QueryClientProvider>
  );
}
