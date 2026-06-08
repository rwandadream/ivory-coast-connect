import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, GraduationCap, FileText, Wallet, ClipboardCheck, TrendingUp, ArrowRight } from "lucide-react";
import { useStore, formatXOF } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Tableau de bord — SARRAH AUTO" }],
  }),
  component: Dashboard,
});

function StatCard({
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
    <Card className={accent ? "border-primary/20 bg-gradient-subtle shadow-elegant" : "shadow-sm"}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${accent ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { eleves, formations, factures, paiements, examens, getStatutFacture, getMontantPaye } = useStore();

  const facturesNonPayees = factures.filter((f) => getStatutFacture(f.id) !== "payee");
  const totalRecouvre = paiements.reduce((s, p) => s + p.montant, 0);
  const totalFacture = factures.reduce((s, f) => s + f.montant, 0);
  const examensProgrammes = examens.filter((e) => e.resultat === "en_attente").length;

  const moisActuel = new Date().getMonth();
  const nouveauxCeMois = eleves.filter((e) => new Date(e.createdAt).getMonth() === moisActuel).length;

  const recentEleves = eleves.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre auto-école"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Élèves" value={eleves.length} hint={`+${nouveauxCeMois} ce mois`} icon={Users} accent />
        <StatCard label="Formations" value={formations.filter((f) => f.actif).length} hint={`${formations.length} au total`} icon={GraduationCap} />
        <StatCard label="Factures en attente" value={facturesNonPayees.length} hint={formatXOF(facturesNonPayees.reduce((s, f) => s + (f.montant - getMontantPaye(f.id)), 0))} icon={FileText} />
        <StatCard label="Examens programmés" value={examensProgrammes} icon={ClipboardCheck} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> Synthèse financière
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Total facturé</p>
                <p className="mt-1 text-xl font-bold">{formatXOF(totalFacture)}</p>
              </div>
              <div className="rounded-lg bg-success/10 p-4">
                <p className="text-xs text-success">Total recouvré</p>
                <p className="mt-1 text-xl font-bold text-success">{formatXOF(totalRecouvre)}</p>
              </div>
              <div className="rounded-lg bg-warning/20 p-4">
                <p className="text-xs text-warning-foreground">Reste à recouvrer</p>
                <p className="mt-1 text-xl font-bold">{formatXOF(Math.max(0, totalFacture - totalRecouvre))}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-muted-foreground">Paiements récents</p>
              {paiements.slice(0, 4).map((p) => {
                const eleve = eleves.find((e) => e.id === p.eleveId);
                return (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                    <div>
                      <p className="text-sm font-medium">{eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <p className="text-sm font-semibold text-success">{formatXOF(p.montant)}</p>
                  </div>
                );
              })}
              {paiements.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun paiement enregistré pour l'instant.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Nouveaux élèves</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentEleves.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun élève inscrit.</p>
            ) : (
              recentEleves.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {e.prenom[0]}{e.nom[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.prenom} {e.nom}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.typePermis}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{new Date(e.createdAt).toLocaleDateString("fr-FR")}</Badge>
                </div>
              ))
            )}
            <Link to="/eleves" className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Voir tous les élèves <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction to="/eleves" icon={Users} label="Ajouter un élève" />
        <QuickAction to="/formations" icon={GraduationCap} label="Gérer les formations" />
        <QuickAction to="/paiements" icon={Wallet} label="Enregistrer un paiement" />
        <QuickAction to="/examens" icon={ClipboardCheck} label="Planifier un examen" />
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: typeof Users; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground group-hover:bg-gradient-primary group-hover:text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
    </Link>
  );
}
