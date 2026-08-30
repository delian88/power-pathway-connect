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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import { Toaster } from "sonner";

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

import { getSessionFn } from "@/routes/admin/route";
import { api } from "@/lib/api-client";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient, session: any, settings: any }>()({
  beforeLoad: async () => {
    const session = await getSessionFn();
    const settings = await api.getSiteSettings();
    return { session, settings };
  },
  head: (ctx) => {
    const settings = (ctx as any).routeContext?.settings || (ctx as any).context?.settings || {};
    const appName = `${settings.appNameFirstPart || "National Electricity"} ${settings.appNameSecondPart || "Workshop"}`.trim();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: `${appName} — Powering the future together` },
        { name: "description", content: "Premier events and workshops for utility leaders, grid engineers, and energy innovators shaping the national electricity landscape. Join us to transform the energy sector." },
        { name: "keywords", content: "electricity, workshop, energy, Nigeria, summit, grid, innovation" },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `${appName} — Powering the future together` },
        { property: "og:description", content: "Premier events and workshops for the leaders of the national electricity ecosystem. Join us to transform the energy sector." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://electricitylaw2023workshop.com" },
        { property: "og:image", content: settings.faviconUrl || "https://electricitylaw2023workshop.com/2eda31a4-51e1-46a0-88f7-ddfa0ce8310e.jpg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: settings.faviconUrl || "https://electricitylaw2023workshop.com/2eda31a4-51e1-46a0-88f7-ddfa0ce8310e.jpg" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: settings.faviconUrl || "/2eda31a4-51e1-46a0-88f7-ddfa0ce8310e.jpg" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
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
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
