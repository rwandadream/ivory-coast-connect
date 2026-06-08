import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, GraduationCap, FileText, Wallet, ClipboardCheck, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/eleves", label: "Élèves", icon: Users },
  { to: "/formations", label: "Formations", icon: GraduationCap },
  { to: "/factures", label: "Factures", icon: FileText },
  { to: "/paiements", label: "Paiements", icon: Wallet },
  { to: "/examens", label: "Examens", icon: ClipboardCheck },
];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">SARRAH AUTO</h1>
            <p className="text-xs text-sidebar-foreground/60">Auto-école · ERP</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border px-6 py-4 text-xs text-sidebar-foreground/50">
          v1.0 · Données locales
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="no-print fixed inset-x-0 top-0 z-20 flex items-center gap-3 border-b bg-card px-4 py-3 lg:hidden">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary">
          <Car className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold">SARRAH AUTO</span>
      </header>

      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet />
        </div>
        {/* Mobile bottom nav */}
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
      </main>
    </div>
  );
}
