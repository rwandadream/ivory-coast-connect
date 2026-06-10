import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Plus, ClipboardCheck, Trash2, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import { useStore, labelResultat, type ResultatExamen, type Examen } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { examens, eleves, addExamen, updateExamen, deleteExamen } = useStore(
    useShallow((s) => ({
      examens: s.examens,
      eleves: s.eleves,
      addExamen: s.addExamen,
      updateExamen: s.updateExamen,
      deleteExamen: s.deleteExamen,
    })),
  );

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ResultatExamen | "all">("all");
  const [examFilter, setExamFilter] = useState<ExamType | "all">("all");

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Examens"
        description={`${examens.length} examen${examens.length > 1 ? "s" : ""} enregistré${examens.length > 1 ? "s" : ""}`}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={handleOpen}
              className="bg-gradient-primary shadow-glow"
              disabled={eleves.length === 0}
            >
              <Plus className="mr-1 h-4 w-4" /> Inscrire à un examen
            </Button>
            {eleves.length === 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-sm text-muted-foreground">
                  Dossiers d'élèves requis pour les examens.
                </p>
                <Link
                  to="/eleves"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "default" }),
                    "h-9 inline-flex items-center justify-center rounded-md px-4 text-sm font-medium",
                  )}
                >
                  Créer un élève
                </Link>
              </div>
            ) : null}
          </div>
        }
      />

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
          <Select value={examFilter} onValueChange={(v) => setExamFilter(v as typeof examFilter)}>
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
            description={eleves.length === 0 ? "Créez un élève d'abord." : "Inscrivez un élève."}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ex) => {
              const eleve = eleves.find((e) => e.id === ex.eleve_id);
              const meta =
                ex.resultat === "admis"
                  ? { icon: CheckCircle2, color: "bg-success/15 text-success border-success/30" }
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
                    </div>
                    <Badge variant="outline" className={meta.color}>
                      <Icon className="mr-1 h-3 w-3" /> {labelResultat(ex.resultat || "en_attente")}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm">
                    📅{" "}
                    {isClient
                      ? new Date(ex.date_examen).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })
                      : "..."}
                  </p>
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
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setEleveId("");
      setExamType("Code");
      setTypePermis("Permis B");
      setDateExamen(new Date().toISOString().slice(0, 10));
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
              <Input
                id="de"
                type="date"
                value={date_examen}
                onChange={(e) => setDateExamen(e.target.value)}
                required
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
