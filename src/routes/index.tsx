import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useMemo, Suspense, lazy } from "react";
import type { LucideIcon } from "lucide-react";
import { Users, FileText, Wallet, TrendingUp, Plus, Download, CalendarDays } from "lucide-react";
import { formatXOF } from "@/lib/store";
import { cn, downloadCsv } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  useEleves,
  useFormations,
  useFactures,
  usePaiements,
  useInscriptions,
  useExamens,
  useDepenses,
} from "@/lib/api/database.hooks";

const DashboardCharts = lazy(() => import("@/components/DashboardCharts"));
const FinanceChart = lazy(() => import("@/components/FinanceChart"));

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
  index,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: boolean;
  index: number;
}) {
  return (
    <Card
      className={cn(
        "glass group relative overflow-hidden border-slate-700/70 bg-slate-950/80 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)]",
        accent && "border-primary/30",
        "animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both",
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-700 group-hover:bg-primary/20 group-hover:scale-150" />
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 group-hover:text-primary transition-colors duration-300">
              {label}
            </p>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-all duration-300">
              {value}
            </p>
            {hint && (
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors duration-300">
                {hint}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid h-10 w-10 sm:h-14 sm:w-14 place-items-center rounded-xl sm:rounded-2xl shadow-glow transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:shadow-primary/40",
              accent
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-slate-800 text-slate-100 group-hover:bg-slate-700",
            )}
          >
            <Icon className="h-5 w-5 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

function Dashboard() {
  const { data: eleves = [], isLoading: isLoadingEleves } = useEleves();
  const { data: formations = [] } = useFormations();
  const { data: factures = [] } = useFactures();
  const { data: paiements = [] } = usePaiements();
  const { data: inscriptions = [] } = useInscriptions();
  const { data: examens = [] } = useExamens();
  const { data: depenses = [] } = useDepenses();

  const isLoading = isLoadingEleves;

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
        return {
          facture: f,
          inscription,
          eleve,
          formation,
          paye: f.montant_paye,
          statut: f.statut,
        };
      }),
    [factures, eleves, inscriptions, formations],
  );

  const totalRecouvre = useMemo(
    () => paiements.reduce((sum, p) => sum + p.montant, 0),
    [paiements],
  );
  const totalDepenses = useMemo(() => depenses.reduce((sum, d) => sum + d.montant, 0), [depenses]);
  const beneficeTotal = totalRecouvre - totalDepenses;

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

  const depensesMensuelles = useMemo(
    () =>
      depenses
        .filter((d) => {
          const date = new Date(d.date_depense || d.created_at || "");
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, d) => sum + d.montant, 0),
    [depenses, currentMonth, currentYear],
  );

  const beneficeMensuel = paiementsMensuels - depensesMensuelles;

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
  const nouveauxCeMois = useMemo(
    () =>
      eleves.filter((e) => {
        const created = new Date(e.created_at || "");
        return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
      }).length,
    [eleves, currentMonth, currentYear],
  );

  const financeData = useMemo(
    () => [
      { name: "Reçu", value: totalRecouvre, color: "#16a34a" },
      { name: "Dépenses", value: totalDepenses, color: "#ef4444" },
      { name: "Bénéfice", value: Math.max(0, beneficeTotal), color: "#4f46e5" },
    ],
    [totalRecouvre, totalDepenses, beneficeTotal],
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
        const created = new Date(e.created_at || "");
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
        ["Revenus (Total)", `${formatXOF(totalRecouvre)}`],
        ["Dépenses (Total)", `${formatXOF(totalDepenses)}`],
        ["Bénéfice (Total)", `${formatXOF(beneficeTotal)}`],
        ["Revenus mensuels", `${formatXOF(paiementsMensuels)}`],
        ["Dépenses mensuelles", `${formatXOF(depensesMensuelles)}`],
        ["Bénéfice mensuel", `${formatXOF(beneficeMensuel)}`],
        ["Factures impayées", `${statusCounts.facturesNonPayees}`],
        ["Montant à recouvrer", `${formatXOF(statusCounts.facturesToCollect)}`],
      ];

      downloadCsv(rows, `rapport-financier-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      toast.error("Impossible d'exporter le rapport.");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement du tableau de bord...</div>;
  }

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
          index={0}
        />
        <StatCard
          label="Bénéfice Net"
          value={formatXOF(beneficeMensuel)}
          hint="Mois en cours"
          icon={TrendingUp}
          index={1}
        />
        <StatCard
          label="Revenus (Paiements)"
          value={formatXOF(paiementsMensuels)}
          hint="Encaissements du mois"
          icon={Wallet}
          index={2}
        />
        <StatCard
          label="Dépenses"
          value={formatXOF(depensesMensuelles)}
          hint="Sorties du mois"
          icon={FileText}
          index={3}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          <Suspense
            fallback={
              <div className="h-[280px] flex items-center justify-center">
                Chargement des finances...
              </div>
            }
          >
            <FinanceChart data={financeData} />
          </Suspense>

          <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-glow-sm">
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

        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000 delay-500 fill-mode-both">
          <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl transition-all hover:border-primary/20">
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
                      (sum: number, item) => sum + (item.facture.montant - item.paye),
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

      <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
        <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl lg:col-span-2 transition-all hover:border-primary/20">
          <CardHeader>
            <CardTitle className="text-base font-bold">Dernières inscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEleves.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center italic">
                Aucun élève inscrit.
              </p>
            ) : (
              recentEleves.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-300 hover:bg-slate-800 hover:translate-x-2 hover:border-primary/30"
                  style={{ transitionDelay: `${i * 50}ms` }}
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
                    {new Date(e.created_at || "").toLocaleDateString("fr-FR", {
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
