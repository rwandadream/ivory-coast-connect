import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import {
  Users,
  GraduationCap,
  FileText,
  Wallet,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  BarChart3,
  LineChart as LineChartIcon,
  Plus,
  Download,
  CalendarDays,
} from "lucide-react";
import { useStore, formatXOF } from "@/lib/store";
import { cn, downloadCsv } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import React, { Suspense, lazy } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
const DashboardCharts = lazy(() => import("@/components/DashboardCharts"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Tableau de bord — SARAH AUTO" }],
  }),
  component: Dashboard,
});

const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Users;
  accent?: boolean;
}) {
  return (
    <Card
      className={cn(
        "glass glass-hover border-slate-700/70 bg-slate-950/80",
        accent && "border-primary/30",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              {label}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
              {value}
            </p>
            {hint && <p className="mt-2 text-sm leading-6 text-slate-400">{hint}</p>}
          </div>
          <div
            className={cn(
              "grid h-14 w-14 place-items-center rounded-3xl shadow-glow transition-all duration-300",
              accent
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-slate-800 text-slate-100",
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

function Dashboard() {
  const {
    eleves,
    formations,
    factures,
    paiements,
    inscriptions,
    examens,
    getStatutFacture,
    getMontantPaye,
  } = useStore(
    (s) => ({
      eleves: s.eleves,
      formations: s.formations,
      factures: s.factures,
      paiements: s.paiements,
      inscriptions: s.inscriptions,
      examens: s.examens,
      getStatutFacture: s.getStatutFacture,
      getMontantPaye: s.getMontantPaye,
    }),
    shallow,
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const facturesWithDetails = useMemo(
    () =>
      factures.map((f) => {
        const inscription = inscriptions.find((i) => i.id === f.inscription_id);
        const eleve = eleves.find((e) => e.id === f.eleve_id) ?? null;
        const formation = inscription
          ? (formations.find((fr) => fr.id === inscription.formation_id) ?? null)
          : null;
        const paye = getMontantPaye(f.id);
        const statut = getStatutFacture(f.id);
        return { facture: f, inscription, eleve, formation, paye, statut };
      }),
    [factures, eleves, inscriptions, formations, getMontantPaye, getStatutFacture],
  );

  const totalRecouvre = useMemo(
    () => paiements.reduce((sum, p) => sum + p.montant, 0),
    [paiements],
  );
  const totalFacture = useMemo(
    () => facturesWithDetails.reduce((sum, item) => sum + item.facture.montant, 0),
    [facturesWithDetails],
  );
  const examensProgrammes = useMemo(
    () => examens.filter((e) => e.resultat === "en_attente").length,
    [examens],
  );
  const admissionCount = useMemo(
    () => examens.filter((e) => e.resultat === "admis").length,
    [examens],
  );
  const tauxReussite = useMemo(
    () => (examens.length ? Math.round((admissionCount / examens.length) * 100) : 0),
    [admissionCount, examens.length],
  );

  const paiementsMensuels = useMemo(
    () =>
      paiements
        .filter((p) => {
          const date = new Date(p.date_paiement || p.created_at || "");
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + p.montant, 0),
    [paiements, currentMonth, currentYear],
  );

  const paiementsThisMonthCount = useMemo(
    () =>
      paiements.filter((p) => {
        const date = new Date(p.date_paiement || p.created_at || "");
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length,
    [paiements, currentMonth, currentYear],
  );

  const statusCounts = useMemo(
    () =>
      facturesWithDetails.reduce(
        (acc, item) => {
          if (item.statut === "payee") acc.facturesPayees += 1;
          if (item.statut === "partielle") acc.facturesPartielles += 1;
          if (item.statut === "non_payee") acc.facturesNonPayees += 1;
          acc.facturesToCollect += item.statut !== "payee" ? item.facture.montant - item.paye : 0;
          return acc;
        },
        {
          facturesPayees: 0,
          facturesPartielles: 0,
          facturesNonPayees: 0,
          facturesToCollect: 0,
        },
      ),
    [facturesWithDetails],
  );

  const facturesNonPayees = useMemo(
    () => facturesWithDetails.filter((item) => item.statut === "non_payee"),
    [facturesWithDetails],
  );

  const elevesActifs = useMemo(
    () =>
      eleves.filter((eleve) =>
        inscriptions.some((inscription) => inscription.eleve_id === eleve.id),
      ).length,
    [eleves, inscriptions],
  );
  const elevesEnAttente = useMemo(
    () => eleves.length - elevesActifs,
    [eleves.length, elevesActifs],
  );
  const nouveauxCeMois = useMemo(
    () =>
      eleves.filter((e) => {
        const created = new Date(e.created_at);
        return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
      }).length,
    [eleves, currentMonth, currentYear],
  );

  const financeData = useMemo(
    () => [
      { name: "Facturé", value: totalFacture, color: "#4f46e5" },
      { name: "Reçu", value: totalRecouvre, color: "#16a34a" },
      { name: "Reste", value: Math.max(0, totalFacture - totalRecouvre), color: "#f59e0b" },
    ],
    [totalFacture, totalRecouvre],
  );

  const enrollmentData = useMemo(() => {
    const months: { name: string; count: number }[] = [];
    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(currentYear, currentMonth - offset, 1);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const count = eleves.filter((e) => {
        const created = new Date(e.created_at);
        return created.getMonth() === monthIndex && created.getFullYear() === year;
      }).length;
      months.push({ name: monthNames[monthIndex], count });
    }

    return months;
  }, [eleves, currentMonth, currentYear]);

  const recentEleves = useMemo(() => eleves.slice(0, 5), [eleves]);

  const handleExportReport = () => {
    try {
      const rows = [
        ["Clé", "Valeur"],
        ["Élèves totaux", `${eleves.length}`],
        ["Élèves actifs", `${elevesActifs}`],
        ["Nouveaux ce mois", `${nouveauxCeMois}`],
        ["Examens programmés", `${examensProgrammes}`],
        ["Taux de réussite", `${tauxReussite}%`],
        ["Revenus mensuels", `${formatXOF(paiementsMensuels)}`],
        ["Factures impayées", `${statusCounts.facturesNonPayees}`],
        ["Montant à recouvrer", `${formatXOF(statusCounts.facturesToCollect)}`],
      ];

      downloadCsv(rows, `rapport-dashboard-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      toast.error("Impossible d'exporter le rapport.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 pb-10 bg-background text-foreground">
      <PageHeader
        title="Centre de pilotage"
        description="Suivez les indicateurs clés et agissez rapidement."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/eleves"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "gap-2 inline-flex items-center justify-center",
              )}
            >
              <Plus className="h-4 w-4" />
              Ajouter un élève
            </Link>
            <Link
              to="/planning"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "gap-2 inline-flex items-center justify-center",
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Planifier
            </Link>
            <Button
              size="sm"
              variant="default"
              className="gap-2 bg-gradient-primary shadow-glow"
              onClick={handleExportReport}
            >
              <Download className="h-4 w-4" />
              Exporter le rapport
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Élèves Totaux"
          value={eleves.length}
          hint={`${nouveauxCeMois} ce mois`}
          icon={Users}
          accent
        />
        <StatCard
          label="Élèves actifs"
          value={elevesActifs}
          hint={`${elevesEnAttente} en attente`}
          icon={GraduationCap}
        />
        <StatCard
          label="Revenus mensuels"
          value={formatXOF(paiementsMensuels)}
          hint={`${paiementsThisMonthCount} paiements`}
          icon={Wallet}
        />
        <StatCard
          label="Factures impayées"
          value={statusCounts.facturesNonPayees}
          hint={`${formatXOF(statusCounts.facturesToCollect)} à recouvrer`}
          icon={FileText}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl">
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <TrendingUp className="h-5 w-5 text-primary" /> Finances
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Performance et état des paiements
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-2xl border bg-background/95 p-3 shadow-elegant">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {payload[0].payload.name}
                              </p>
                              <p className="mt-1 text-base font-semibold text-foreground">
                                {formatXOF(payload[0].value as number)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={44}>
                      {financeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl">
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold">Tendances élèves</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Nouveaux inscrits et progression
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="min-h-[320px] w-full">
                <Suspense fallback={<div className="h-56">Chargement graphique…</div>}>
                  <DashboardCharts enrollmentData={enrollmentData} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold">Indicateurs clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary">Taux de réussite</p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">{tauxReussite}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur {examens.length} examen{examens.length > 1 ? "s" : ""} enregistrés
                </p>
              </div>
              <div className="rounded-2xl border border-warning/10 bg-warning/5 p-4">
                <p className="text-sm font-semibold text-warning">Examens en attente</p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">{examensProgrammes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Planifiez les sessions et confirmez les convocations
                </p>
              </div>
              <div className="rounded-2xl border border-destructive/10 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive">Factures à recouvrer</p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">
                  {formatXOF(
                    facturesNonPayees.reduce(
                      (sum: number, item) =>
                        sum + (item.facture.montant - getMontantPaye(item.facture.id)),
                      0,
                    ),
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Revenus en souffrance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link
                to="/eleves"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "justify-between rounded-2xl px-4 py-4 font-semibold inline-flex w-full",
                )}
              >
                Gérer les élèves
              </Link>
              <Link
                to="/factures"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "justify-between rounded-2xl px-4 py-4 font-semibold inline-flex w-full",
                )}
              >
                Vérifier les factures impayées
              </Link>
              <Link
                to="/examens"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "justify-between rounded-2xl px-4 py-4 font-semibold inline-flex w-full",
                )}
              >
                Planifier un examen
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Dernières inscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEleves.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center italic">
                Aucun élève inscrit.
              </p>
            ) : (
              recentEleves.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:bg-slate-800/70"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-sm">
                    {e.prenom[0]}
                    {e.nom[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {e.prenom} {e.nom}
                    </p>
                    <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                      {e.type_permis}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/20 bg-primary/5 text-primary font-bold px-2"
                  >
                    {new Date(e.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold">Suivi rapide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-4">
              <p className="text-sm font-semibold text-secondary">Formations disponibles</p>
              <p className="mt-1 text-3xl font-extrabold text-foreground">
                {formations.filter((f) => f.actif).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Catalogue actuel</p>
            </div>
            <div className="rounded-2xl border border-muted/20 bg-muted/10 p-4">
              <p className="text-sm font-semibold text-foreground">Progression des élèves</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Consultez les dossiers individuels pour voir les étapes de formation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
