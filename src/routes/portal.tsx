import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import {
  LogOut,
  CalendarDays,
  FileText,
  Wallet,
  ClipboardCheck,
  Download,
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useStore, formatXOF, formatTel } from "@/lib/store";
import { clearSession, getSessionId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title: "Mon Espace — SARAH AUTO" }] }),
  component: StudentPortal,
});

function StudentPortal() {
  const navigate = useNavigate();
  const studentId = getSessionId();

  const {
    eleves,
    planning_sessions,
    factures,
    paiements,
    examens,
    formations,
    getStatutFacture,
    getMontantPaye,
  } = useStore(
    useShallow((s) => ({
      eleves: s.eleves,
      planning_sessions: s.planning_sessions,
      factures: s.factures,
      paiements: s.paiements,
      examens: s.examens,
      formations: s.formations,
      getStatutFacture: s.getStatutFacture,
      getMontantPaye: s.getMontantPaye,
    })),
  );

  const student = useMemo(() => eleves.find((e) => e.id === studentId), [eleves, studentId]);

  const studentPlanning = useMemo(
    () =>
      planning_sessions
        .filter((s) => s.eleve_id === studentId)
        .sort((a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime()),
    [planning_sessions, studentId],
  );

  const studentFactures = useMemo(
    () => factures.filter((f) => f.eleve_id === studentId),
    [factures, studentId],
  );

  const studentExamens = useMemo(
    () => examens.filter((x) => x.eleve_id === studentId),
    [examens, studentId],
  );

  const totalMontant = useMemo(
    () => studentFactures.reduce((sum, f) => sum + f.montant, 0),
    [studentFactures],
  );
  const totalPaye = useMemo(
    () => paiements.filter((p) => p.eleve_id === studentId).reduce((sum, p) => sum + p.montant, 0),
    [paiements, studentId],
  );
  const resteAPayer = Math.max(0, totalMontant - totalPaye);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const handleLogout = () => {
    clearSession();
    toast.success("Déconnexion réussie");
    navigate({ to: "/login" });
  };

  const handleDownloadInvoice = async (factureId: string) => {
    const f = factures.find((x) => x.id === factureId);
    if (!f || !student) return;
    const formation = formations.find((fr) => fr.id === f.inscription_id); // Inscription ID stores formation link usually or we need to find inscription first
    // In our store, inscription has formation_id. Let's find it.
    const inscription = useStore.getState().inscriptions.find((i) => i.id === f.inscription_id);
    const formationData = formations.find((fr) => fr.id === inscription?.formation_id);

    try {
      await generateInvoicePDF({
        numero: f.numero,
        date: f.date_emission || f.created_at,
        eleve: {
          nom: student.nom,
          prenom: student.prenom,
          telephone: student.telephone,
          adresse: student.adresse ?? undefined,
        },
        formation: formationData?.nom || "Formation Permis",
        montant: f.montant,
        paiements: paiements
          .filter((p) => p.facture_id === f.id)
          .map((p) => ({
            date: p.date_paiement || p.created_at,
            montant: p.montant,
            mode: p.mode_paiement,
          })),
      });
      toast.success("Facture téléchargée");
    } catch (e) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  if (!isClient || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-4 py-4">
        <div className="mx-auto max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Espace Élève
              </p>
              <p className="font-bold text-slate-100">
                {student.prenom} {student.nom}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-lg p-4 space-y-6">
        {/* Statut Card */}
        <Card className="border-primary/20 bg-primary/5 shadow-glow-sm overflow-hidden rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-tighter">
                  Code Dossier
                </p>
                <p className="text-2xl font-black tracking-tighter">{student.dossier_code}</p>
              </div>
              <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1">
                {student.statut.replace("_", " ")}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2 text-sm text-slate-300">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{formatTel(student.telephone)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-slate-800 rounded-3xl">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase font-bold text-slate-500">Payé</p>
              <p className="text-xl font-bold text-green-400 mt-1">{formatXOF(totalPaye)}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 rounded-3xl">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase font-bold text-slate-500">Reste</p>
              <p className="text-xl font-bold text-orange-400 mt-1">{formatXOF(resteAPayer)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/80 rounded-2xl p-1 h-12 border border-slate-800">
            <TabsTrigger
              value="planning"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <CalendarDays className="h-4 w-4 mr-2 hidden sm:block" />
              Planning
            </TabsTrigger>
            <TabsTrigger
              value="finances"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Wallet className="h-4 w-4 mr-2 hidden sm:block" />
              Finances
            </TabsTrigger>
            <TabsTrigger
              value="resultats"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <ClipboardCheck className="h-4 w-4 mr-2 hidden sm:block" />
              Résultats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Mes Séances</h3>
              <Badge variant="outline" className="border-slate-700 text-slate-400">
                {studentPlanning.length} séance(s)
              </Badge>
            </div>

            {studentPlanning.length === 0 ? (
              <div className="text-center py-10 text-slate-500 italic border-2 border-dashed border-slate-800 rounded-3xl">
                Aucune séance planifiée.
              </div>
            ) : (
              studentPlanning.map((session) => (
                <Card
                  key={session.id}
                  className="bg-slate-900/50 border-slate-800 rounded-[1.5rem] hover:border-primary/30 transition-all"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-800 text-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{session.titre}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        {new Date(session.date_heure).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-tighter">
                        {new Date(session.date_heure).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {session.duree_minutes} min
                      </p>
                    </div>
                    {session.lieu && (
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="bg-slate-800 text-slate-300 text-[10px]"
                        >
                          <MapPin className="h-3 w-3 mr-1" /> {session.lieu}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="finances" className="mt-6 space-y-4">
            <h3 className="text-lg font-bold">Mes Factures</h3>
            {studentFactures.length === 0 ? (
              <div className="text-center py-10 text-slate-500 italic border-2 border-dashed border-slate-800 rounded-3xl">
                Aucune facture enregistrée.
              </div>
            ) : (
              studentFactures.map((f) => {
                const statut = getStatutFacture(f.id);
                return (
                  <Card key={f.id} className="bg-slate-900/50 border-slate-800 rounded-[1.5rem]">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-500">{f.numero}</p>
                        <p className="text-lg font-bold mt-1">{formatXOF(f.montant)}</p>
                        <Badge
                          className={cn(
                            "mt-2 font-bold text-[10px] uppercase",
                            statut === "payee"
                              ? "bg-green-500/20 text-green-400"
                              : statut === "partielle"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-red-500/20 text-red-400",
                          )}
                        >
                          {statut.replace("_", " ")}
                        </Badge>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-2xl border-slate-700 hover:bg-primary hover:text-white"
                        onClick={() => handleDownloadInvoice(f.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="resultats" className="mt-6 space-y-4">
            <h3 className="text-lg font-bold">Mes Examens</h3>
            {studentExamens.length === 0 ? (
              <div className="text-center py-10 text-slate-500 italic border-2 border-dashed border-slate-800 rounded-3xl">
                Aucun examen enregistré.
              </div>
            ) : (
              studentExamens.map((x) => (
                <Card key={x.id} className="bg-slate-900/50 border-slate-800 rounded-[1.5rem]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-2xl",
                        x.resultat === "admis"
                          ? "bg-green-500/20 text-green-400"
                          : x.resultat === "echec"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-slate-800 text-slate-400",
                      )}
                    >
                      {x.resultat === "admis" ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : x.resultat === "echec" ? (
                        <AlertCircle className="h-6 w-6" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{x.type_examen}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Le {new Date(x.date_examen).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-bold uppercase text-[10px]",
                        x.resultat === "admis"
                          ? "border-green-500/50 text-green-400"
                          : x.resultat === "echec"
                            ? "border-red-500/50 text-red-400"
                            : "border-slate-700 text-slate-500",
                      )}
                    >
                      {x.resultat ? x.resultat.replace("_", " ") : "En attente"}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6">
        <a
          href={`https://wa.me/2250707070707?text=Bonjour,%20je%20suis%20l'élève%20${student.prenom}%20${student.nom}%20(Code:%20${student.dossier_code}).%20J'ai%20une%20question.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 hover:bg-green-600 shadow-glow text-white transition-transform duration-300 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
