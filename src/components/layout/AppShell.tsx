import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  Car,
  LogOut,
  Menu,
  ChevronLeft,
  Search,
  Bell,
  UserCircle,
  CalendarDays,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/eleves", label: "Élèves", icon: Users },
  { to: "/moniteurs", label: "Moniteurs", icon: UserCircle },
  { to: "/formations", label: "Formations", icon: GraduationCap },
  { to: "/planning", label: "Planning", icon: CalendarDays },
  { to: "/factures", label: "Factures", icon: FileText },
  { to: "/paiements", label: "Paiements", icon: Wallet },
  { to: "/examens", label: "Examens", icon: ClipboardCheck },
  { to: "/users", label: "Utilisateurs", icon: ShieldCheck },
];

const breadcrumbLabels: Record<string, string> = {
  "": "Tableau de bord",
  eleves: "Élèves",
  moniteurs: "Moniteurs",
  formations: "Formations",
  planning: "Planning",
  factures: "Factures",
  paiements: "Paiements",
  examens: "Examens",
  users: "Utilisateurs",
};

export function AppShell({
  children,
  sessionId,
  sessionType,
}: {
  children: ReactNode;
  sessionId?: string | null;
  sessionType?: "admin" | "eleve" | null;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  const isAdmin = sessionId && sessionType === "admin";

  const breadcrumbs = useMemo(
    () =>
      segments.map((segment, index) => ({
        label: breadcrumbLabels[segment] ?? segment,
        href: `/${segments.slice(0, index + 1).join("/")}`,
      })),
    [segments],
  );

  const activeSection =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Tableau de bord";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("sarah_auto_theme");
    const preferredTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(preferredTheme);
    document.documentElement.classList.toggle("dark", preferredTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("sarah_auto_theme", nextTheme);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {isAdmin && (
        <aside
          className={cn(
            "no-print fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex",
            collapsed ? "w-20 border-sidebar-border" : "w-72 border-sidebar-border",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/80 bg-background/95 px-4 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-3xl bg-gradient-primary shadow-glow text-primary-foreground">
                <Car className="h-5 w-5" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                    SARAH AUTO
                  </p>
                  <p className="text-[11px] text-muted-foreground">ERP Auto-école</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-xl text-sidebar-foreground hover:bg-sidebar/70 hover:text-foreground"
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {navItems.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 transition duration-300",
                    active
                      ? "bg-sidebar/80 text-foreground shadow-sm ring-1 ring-primary/30"
                      : "text-sidebar-foreground hover:bg-sidebar/80 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      active ? "text-primary" : "text-slate-400 group-hover:text-primary",
                    )}
                  />
                  {!collapsed && <span className="text-sm font-medium">{label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className={cn("border-t border-slate-800 p-4", collapsed ? "hidden" : "")}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:bg-red-500/10 hover:text-red-300"
              onClick={() => {
                clearSession();
                toast.success("Déconnexion réussie");
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
            <div className="mt-4 text-center text-[10px] text-slate-400/70">v2.0</div>
          </div>
        </aside>
      )}

      <main className={cn("flex-1 transition-all duration-300", isAdmin && (collapsed ? "lg:pl-20" : "lg:pl-72"))}>
        {isAdmin && (
          <div
            className={cn(
              "no-print fixed inset-x-0 top-0 z-20 border-b border-sidebar-border bg-background/95 backdrop-blur-xl lg:right-0",
              collapsed ? "lg:left-20" : "lg:left-72",
            )}
          >
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Section</p>
                  <p className="text-lg font-semibold text-foreground">{activeSection}</p>
                </div>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl text-slate-300 hover:text-slate-100"
                  onClick={() => toast("Aucune nouvelle notification pour le moment.")}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl text-slate-300 hover:text-slate-100"
                  onClick={toggleTheme}
                  aria-label="Changer le thème"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => toast("Espace administrateur actif.")}
                >
                  <UserCircle className="h-4 w-4" />
                  Admin
                </Button>
              </div>
            </div>
            <div className="border-t border-slate-800 px-4 py-2 text-xs text-muted-foreground sm:px-6 lg:px-8">
              {breadcrumbs.length === 0 ? (
                <span>Tableau de bord</span>
              ) : (
                breadcrumbs.map((crumb, index) => (
                  <span key={crumb.href} className="inline-flex items-center gap-2">
                    <Link to={crumb.href} className="font-medium text-primary hover:underline">
                      {crumb.label}
                    </Link>
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-muted-foreground">/</span>
                    )}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        <div className={cn(
          "mx-auto w-full max-w-full px-4 pb-12 sm:px-6 lg:px-8 animate-fade-in-up bg-background text-foreground",
          isAdmin ? "pt-24 lg:pt-28" : "pt-0"
        )}>
          {children}
        </div>

        {isAdmin && (
          <nav className="no-print fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-card py-2 lg:hidden">
            {navItems.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label.split(" ")[0]}
                </Link>
              );
            })}
          </nav>
        )}
      </main>
    </div>
  );
}
