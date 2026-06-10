import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useShallow } from "zustand/shallow";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/lib/store";
import { getSessionEmail } from "@/lib/auth";

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg text-left overflow-auto max-h-60">
          <p className="text-xs font-mono text-destructive font-bold">{error.message}</p>
          {error.stack && (
            <pre className="mt-2 text-[10px] font-mono text-muted-foreground">{error.stack}</pre>
          )}
        </div>
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
      { title: "SARAH AUTO — Gestion Auto-École" },
      {
        name: "description",
        content:
          "Plateforme de gestion d'auto-école : élèves, formations, factures, paiements et examens.",
      },
      { property: "og:title", content: "SARAH AUTO" },
      { property: "og:description", content: "ERP/CRM pour la gestion d'une auto-école." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
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
  const fetchData = useStore(useShallow((s) => s.fetchData));
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = getSessionEmail();
    setSessionEmail(storedEmail);
    setIsAuthLoading(false);

    const publicRoutes = ["/login", "/signup"];
    if (!storedEmail && !publicRoutes.includes(location.pathname)) {
      navigate({ to: "/login" });
    }
    if (storedEmail && publicRoutes.includes(location.pathname)) {
      navigate({ to: "/" });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (sessionEmail) {
      fetchData();
    }
  }, [sessionEmail, fetchData]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <QueryClientProvider client={queryClient}>
        {isAuthLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <RootLayout sessionEmail={sessionEmail}>
            <Outlet />
          </RootLayout>
        )}
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

function RootLayout({
  children,
  sessionEmail,
}: {
  children: ReactNode;
  sessionEmail: string | null;
}) {
  // Use a key to force re-mounting of the whole layout when session state changes
  // This is safer than trying to reconcile two completely different structures
  return (
    <div key={sessionEmail ? "auth" : "public"} className="contents">
      {sessionEmail ? <AppShell>{children}</AppShell> : children}
    </div>
  );
}
