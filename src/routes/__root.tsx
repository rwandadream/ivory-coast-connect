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
import { getCurrentUser, getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
  ssr: false,
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
    <html lang="fr" suppressHydrationWarning>
      <head>
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
  const fetchData = useStore(useShallow((s) => s.fetchData));
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<"admin" | "eleve" | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Stability Phase 1: Pure Mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stability Phase 2: Auth and Data
  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      const session = await getSession();
      const publicRoutes = ["/login", "/signup"];
      const isPublic = publicRoutes.includes(location.pathname);

      if (session) {
        setSessionId(session.user.id);
        setSessionType("admin");
        if (isPublic) navigate({ to: "/" });
      } else {
        const localId = localStorage.getItem("sarah_auto_session_id");
        const localType = localStorage.getItem("sarah_auto_session_type") as "admin" | "eleve" | null;

        if (localId && localType === "eleve") {
          setSessionId(localId);
          setSessionType("eleve");
          if (isPublic) navigate({ to: "/portal" });
        } else if (!isPublic) {
          navigate({ to: "/login" });
        }
      }
      setIsAuthLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setSessionId(session.user.id);
        setSessionType("admin");
      } else if (event === "SIGNED_OUT") {
        setSessionId(null);
        setSessionType(null);
        navigate({ to: "/login" });
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, navigate, mounted]);

  useEffect(() => {
    if (sessionId && mounted) {
      fetchData();
    }
  }, [sessionId, fetchData, mounted]);

  // Expert Fix: Return exactly what the server rendered (or nothing) on the first pass
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
      <QueryClientProvider client={queryClient}>
        <RootLayout sessionId={sessionId} sessionType={sessionType}>
          {isAuthLoading ? (
            <div className="flex min-h-screen items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <Outlet />
          )}
        </RootLayout>
        <Toaster position="top-right" closeButton richColors />
      </QueryClientProvider>
    </div>
  );
}

function RootLayout({
  children,
  sessionId,
  sessionType,
}: {
  children: ReactNode;
  sessionId: string | null;
  sessionType: "admin" | "eleve" | null;
}) {
  return (
    <AppShell sessionId={sessionId} sessionType={sessionType}>
      {children}
    </AppShell>
  );
}
