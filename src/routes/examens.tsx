import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import {
  Plus,
  ClipboardCheck,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  MessageCircle,
  Users,
  Search,
} from "lucide-react";
import {
  useStore,
  labelResultat,
  type ResultatExamen,
  type Examen,
  type Eleve,
  type ExamenSession,
  type ExamenSessionEleve,
  type Tables,
} from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCard } from "@/components/examens/SessionCard";
import { SessionDialog } from "@/components/examens/SessionDialog";
import { SessionElevesDialog } from "@/components/examens/SessionElevesDialog";
import { ResultatsSession } from "@/components/examens/ResultatsSession";
import { generateBordereauPDF } from "@/components/examens/BordereauPDF";
import { toast } from "sonner";

export const Route = createFileRoute("/examens")({
  head: () => ({ meta: [{ title: "Examens — SARAH AUTO" }] }),
  component: ExamensPage,
});

const EXAM_TYPES = ["Code", "Conduite"] as const;
const TYPES_PERMIS = ["Permis A", "Permis B", "Permis AB", "Permis BCDE", "Permis ABCD"] as const;

type ExamType = (typeof EXAM_TYPES)[number];
type PermisType = (typeof TYPES_PERMIS)[number];

function ExamensPage() {
  const {
    examens,
    eleves,
    examen_sessions,
    examen_session_eleves,
    addExamen,
    updateExamen,
    deleteExamen,
    addExamenSession,
    updateExamenSession,
    deleteExamenSession,
    addElevesToSession,
    removeEleveFromSession,
  } = useStore(
    useShallow((s) => ({
      examens: s.examens,
      eleves: s.eleves,
      examen_sessions: s.examen_sessions,
      examen_session_eleves: s.examen_session_eleves,
      addExamen: s.addExamen,
      updateExamen: s.updateExamen,
      deleteExamen: s.deleteExamen,
      addExamenSession: s.addExamenSession,
      updateExamenSession: s.updateExamenSession,
      deleteExamenSession: s.deleteExamenSession,
      addElevesToSession: s.addElevesToSession,
      removeEleveFromSession: s.removeEleveFromSession,
    })),
  );

  const [open, setOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [elevesDialogOpen, setElevesDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ExamenSession | null>(null);
  const [activeSession, setActiveSession] = useState<ExamenSession | null>(null);

  const [filter, setFilter] = useState<ResultatExamen | "all">("all");
  const [examFilter, setExamFilter] = useState<ExamType | "all">("all");
  const [sessionSearch, setSessionSearch] = useState("");

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filtered = useMemo(
    () =>
      examens.filter(
        (e) =>
          (filter === "all" || e.resultat === filter) &&
          (examFilter === "all" || e.type_examen === examFilter),
      ),
    [examens, filter, examFilter],
  );

  const stats = useMemo(
    () => ({
      enAttente: examens.filter((e) => e.resultat === "en_attente").length,
      admis: examens.filter((e) => e.resultat === "admis").length,
      echecs: examens.filter((e) => e.resultat === "echec").length,
      code: examens.filter((e) => e.type_examen === "Code").length,
      conduite: examens.filter((e) => e.type_examen === "Conduite").length,
    }),
    [examens],
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleWhatsAppReminder = (ex: Examen, eleve: Eleve | null | undefined) => {
    if (!eleve) return;
    const cleanTel = eleve.telephone.replace(/\D/g, "");
    const dateStr = new Date(ex.date_examen).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const message = `Bonjour ${eleve.prenom} ${eleve.nom}, c'est l'auto-école SARAH AUTO. Un petit rappel concernant votre examen de ${ex.type_examen} (${ex.type_permis}) prévu pour le ${dateStr}. N'oubliez pas vos documents originaux. Bon courage !`;
    window.open(`https://wa.me/225${cleanTel}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Examens"
        description={`${examens.length} examen${examens.length > 1 ? "s" : ""} enregistré${examens.length > 1 ? "s" : ""}`}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={() => {
                setEditingSession(null);
                setSessionDialogOpen(true);
              }}
              className="bg-gradient-primary shadow-glow"
            >
              <Plus className="mr-1 h-4 w-4" /> Créer une session
            </Button>
            <Button variant="outline" onClick={handleOpen} disabled={eleves.length === 0}>
              <Plus className="mr-1 h-4 w-4" /> Inscription individuelle
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="sessions" className="gap-2">
            <ClipboardCheck className="h-4 w-4" /> Sessions & Bordereaux
          </TabsTrigger>
          <TabsTrigger value="individuels" className="gap-2">
            <Users className="h-4 w-4" /> Inscriptions individuelles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{examen_sessions.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Programmées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {examen_sessions.filter((s) => s.statut === "programmée").length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Terminées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {examen_sessions.filter((s) => s.statut === "terminée").length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Candidats Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{examen_session_eleves.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une session..."
                className="pl-9"
                value={sessionSearch}
                onChange={(e) => setSessionSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examen_sessions
              .filter((s) => s.titre.toLowerCase().includes(sessionSearch.toLowerCase()))
              .map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onEdit={(s) => {
                    setEditingSession(s);
                    setSessionDialogOpen(true);
                  }}
                  onDelete={(id) => {
                    if (confirm("Supprimer cette session et tous ses résultats associés ?")) {
                      deleteExamenSession(id);
                      toast.success("Session supprimée");
                    }
                  }}
                  onView={(s) => {
                    setActiveSession(s);
                    setResultsDialogOpen(true);
                  }}
                />
              ))}
            {examen_sessions.length === 0 && (
              <div className="col-span-full py-12">
                <EmptyState
                  icon={ClipboardCheck}
                  title="Aucune session"
                  description="Commencez par créer votre première session d'examen pour générer des bordereaux."
                  action={
                    <Button onClick={() => setSessionDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Créer une session
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="individuels" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <Card className="border-border bg-card/70 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle>Total</CardTitle>
                <CardDescription>Examens planifiés</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{examens.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader>
                <CardTitle>En attente</CardTitle>
                <CardDescription>Résultats</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.enAttente}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader>
                <CardTitle>Admis</CardTitle>
                <CardDescription>Succès</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.admis}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader>
                <CardTitle>Échecs</CardTitle>
                <CardDescription>Recalés</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.echecs}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader>
                <CardTitle>Code</CardTitle>
                <CardDescription>Théorique</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.code}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/70 shadow-sm">
              <CardHeader>
                <CardTitle>Conduite</CardTitle>
                <CardDescription>Pratique</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.conduite}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto] items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="admis">Admis</SelectItem>
                  <SelectItem value="echec">Échec</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={examFilter}
                onValueChange={(v) => setExamFilter(v as typeof examFilter)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {EXAM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="min-h-[300px]">
            {filtered.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title={examens.length === 0 ? "Aucun examen" : "Aucun résultat"}
                description={
                  eleves.length === 0 ? "Créez un élève d'abord." : "Inscrivez un élève."
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((ex) => {
                  const eleve = eleves.find((e) => e.id === ex.eleve_id);
                  const meta =
                    ex.resultat === "admis"
                      ? {
                          icon: CheckCircle2,
                          color: "bg-success/15 text-success border-success/30",
                        }
                      : ex.resultat === "echec"
                        ? {
                            icon: XCircle,
                            color: "bg-destructive/15 text-destructive border-destructive/30",
                          }
                        : {
                            icon: Clock,
                            color: "bg-warning/20 text-warning-foreground border-warning/40",
                          };
                  const Icon = meta.icon;
                  return (
                    <Card key={ex.id} className="p-4 transition-all hover:shadow-elegant">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">
                            {eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ex.type_permis} • {ex.type_examen}
                          </p>
                          {ex.inspecteur && (
                            <p className="text-[10px] font-medium text-primary mt-0.5">
                              Inspecteur: {ex.inspecteur}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className={meta.color}>
                          <Icon className="mr-1 h-3 w-3" />{" "}
                          {labelResultat(ex.resultat || "en_attente")}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm">
                          📅{" "}
                          {isClient
                            ? new Date(ex.date_examen).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })
                            : "..."}
                        </p>
                        {ex.resultat === "en_attente" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                            onClick={() => handleWhatsAppReminder(ex, eleve)}
                            title="Rappeler via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="mt-4 flex gap-1.5">
                        {ex.resultat === "en_attente" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-success"
                              onClick={() => updateExamen(ex.id, { resultat: "admis" })}
                            >
                              Admis
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-destructive"
                              onClick={() => updateExamen(ex.id, { resultat: "echec" })}
                            >
                              Échec
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive ml-auto"
                          onClick={() => {
                            if (confirm("Supprimer ?")) {
                              deleteExamen(ex.id);
                              toast.success("Supprimé");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Existing Individual Exam Dialog */}
      <ExamenDialog
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => {
          await addExamen(data);
          toast.success("Examen programmé");
          setOpen(false);
        }}
      />

      {/* New Session Management Dialogs */}
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        session={editingSession}
        onSave={async (data) => {
          if (editingSession) {
            await updateExamenSession(editingSession.id, data);
            toast.success("Session mise à jour");
          } else {
            await addExamenSession(data as Tables["examen_sessions"]["Insert"]);
            toast.success("Session créée");
          }
        }}
      />

      {activeSession && (
        <>
          <ResultatsSession
            open={resultsDialogOpen}
            onOpenChange={setResultsDialogOpen}
            session={activeSession}
            eleves={examen_session_eleves.filter((e) => e.session_id === activeSession.id)}
          />
          <SessionElevesDialog
            open={elevesDialogOpen}
            onOpenChange={setElevesDialogOpen}
            sessionId={activeSession.id}
            categorie={activeSession.categorie}
            existingEleveIds={examen_session_eleves
              .filter((e) => e.session_id === activeSession.id)
              .map((e) => e.eleve_id)}
            onAdd={async (ids) => {
              await addElevesToSession(activeSession.id, ids);
              toast.success(`${ids.length} élève(s) ajouté(s)`);
            }}
          />
        </>
      )}

      {/* Action Buttons for active session - displayed in Results dialog or similar */}
    </div>
  );
}

function ExamenDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onSubmit: (d: Omit<Examen, "id" | "created_at">) => Promise<void>;
}) {
  const { eleves } = useStore(useShallow((s) => ({ eleves: s.eleves })));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eleve_id, setEleveId] = useState("");
  const [exam_type, setExamType] = useState<ExamType>("Code");
  const [type_permis, setTypePermis] = useState<PermisType>("Permis B");
  const [date_examen, setDateExamen] = useState(new Date().toISOString().slice(0, 10));
  const [inspecteur, setInspecteur] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setEleveId("");
      setExamType("Code");
      setTypePermis("Permis B");
      setDateExamen(new Date().toISOString().slice(0, 10));
      setInspecteur("");
      setNotes("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Inscrire à un examen</DialogTitle>
          <DialogDescription>Programmer une date d'examen pour un élève.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto px-1">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!eleve_id || !date_examen || eleve_id === "none") {
                toast.error("Élève et date requis");
                return;
              }
              setIsSubmitting(true);
              try {
                await onSubmit({
                  eleve_id,
                  type_examen: exam_type,
                  type_permis,
                  date_examen,
                  inspecteur: inspecteur || null,
                  inspecteur_id: null,
                  resultat: "en_attente",
                  notes: notes || null,
                  formation_id: null,
                });
              } catch (err) {
                toast.error("Erreur technique");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="grid gap-4 py-4"
          >
            <div className="space-y-2">
              <Label>Élève *</Label>
              <Select
                value={eleve_id}
                onValueChange={(v) => {
                  setEleveId(v);
                  if (v !== "none") {
                    const e = eleves.find((x) => x.id === v);
                    if (e) setTypePermis(`Permis ${e.type_permis}` as PermisType);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>
                    Choisir un élève...
                  </SelectItem>
                  {eleves.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.prenom} {e.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type d'examen *</Label>
                <Select value={exam_type} onValueChange={(v) => setExamType(v as ExamType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type de permis *</Label>
                <Select value={type_permis} onValueChange={(v) => setTypePermis(v as PermisType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES_PERMIS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="de">Date *</Label>
              <DatePicker value={date_examen} onChange={setDateExamen} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ins">Inspecteur</Label>
              <Input
                id="ins"
                value={inspecteur}
                onChange={(e) => setInspecteur(e.target.value)}
                placeholder="Nom de l'inspecteur..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nt">Notes</Label>
              <Textarea id="nt" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
                {isSubmitting ? "En cours..." : "Programmer"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
