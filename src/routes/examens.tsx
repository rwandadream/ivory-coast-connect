import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { shallow } from "zustand/shallow";
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
    (s) => ({
      examens: s.examens,
      eleves: s.eleves,
      addExamen: s.addExamen,
      updateExamen: s.updateExamen,
      deleteExamen: s.deleteExamen,
    }),
    shallow,
  );
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ResultatExamen | "all">("all");
  const [examFilter, setExamFilter] = useState<ExamType | "all">("all");

  const filtered = examens.filter(
    (e) =>
      (filter === "all" || e.resultat === filter) &&
      (examFilter === "all" || e.type_examen === examFilter),
  );

  const totalEnAttente = examens.filter((e) => e.resultat === "en_attente").length;
  const totalAdmis = examens.filter((e) => e.resultat === "admis").length;
  const totalEchecs = examens.filter((e) => e.resultat === "echec").length;
  const totalCode = examens.filter((e) => e.type_examen === "Code").length;
  const totalConduite = examens.filter((e) => e.type_examen === "Conduite").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Examens"
        description={`${examens.length} examen${examens.length > 1 ? "s" : ""} enregistré${examens.length > 1 ? "s" : ""}`}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-primary shadow-glow"
            disabled={eleves.length === 0}
          >
            <Plus className="mr-1 h-4 w-4" /> Inscrire à un examen
          </Button>
          {eleves.length === 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-muted-foreground">
                Vous devez d'abord créer un élève dans la page <Link className="font-medium text-primary hover:underline" to="/eleves">Élèves</Link> avant de pouvoir l'inscrire à un examen.
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
            <CardDescription>Résultats non communiqués</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalEnAttente}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Admis</CardTitle>
            <CardDescription>Candidats reçus</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAdmis}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Échecs</CardTitle>
            <CardDescription>Candidats échoués</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalEchecs}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Code</CardTitle>
            <CardDescription>Examens de code</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCode}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Conduite</CardTitle>
            <CardDescription>Examens de conduite</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalConduite}</p>
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
              {EXAM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={examens.length === 0 ? "Aucun examen" : "Aucun résultat"}
          description={
            eleves.length === 0
              ? "Créez un élève avant de programmer un examen."
              : "Inscrivez un élève à un examen."
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => {
            const eleve = eleves.find((e) => e.id === ex.eleve_id);
            const statutMeta = ({
              en_attente: {
                icon: Clock,
                color: "bg-warning/20 text-warning-foreground border-warning/40",
              },
              admis: { icon: CheckCircle2, color: "bg-success/15 text-success border-success/30" },
              echec: {
                icon: XCircle,
                color: "bg-destructive/15 text-destructive border-destructive/30",
              },
            }[ex.resultat || "en_attente"] ?? {
              icon: Clock,
              color: "bg-warning/20 text-warning-foreground border-warning/40",
            });
            const Icon = statutMeta.icon;
            return (
              <Card key={ex.id} className="p-4 transition-all hover:shadow-elegant">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}</p>
                    <p className="text-xs text-muted-foreground">{ex.type_permis} • {ex.type_examen || "Code"}</p>
                  </div>
                  <Badge variant="outline" className={statutMeta.color}>
                    <Icon className="mr-1 h-3 w-3" /> {labelResultat(ex.resultat || "en_attente")}
                  </Badge>
                </div>
                <p className="mt-3 text-sm">
                  📅{" "}
                  {new Date(ex.date_examen).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {ex.notes && (
                  <p className="mt-2 text-xs text-muted-foreground italic">{ex.notes}</p>
                )}
                <div className="mt-4 flex gap-1.5">
                  {ex.resultat === "en_attente" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-success hover:bg-success/10"
                        onClick={() => {
                          updateExamen(ex.id, { resultat: "admis" });
                          toast.success("Marqué admis");
                        }}
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Admis
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          updateExamen(ex.id, { resultat: "echec" });
                          toast.success("Marqué échec");
                        }}
                      >
                        <XCircle className="mr-1 h-3 w-3" /> Échec
                      </Button>
                    </>
                  )}
                  {ex.resultat !== "en_attente" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => updateExamen(ex.id, { resultat: "en_attente" })}
                    >
                      <Clock className="mr-1 h-3 w-3" /> Remettre en attente
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Supprimer cet examen ?")) {
                        deleteExamen(ex.id);
                        toast.success("Examen supprimé");
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ExamenDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          addExamen(data);
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
  onSubmit: (d: Omit<Examen, "id" | "created_at">) => void;
}) {
  const { eleves } = useStore(
    (s) => ({ eleves: s.eleves }),
    shallow,
  );
  const [eleve_id, setEleveId] = useState("");
  const [exam_type, setExamType] = useState<ExamType>("Code");
  const [type_permis, setTypePermis] = useState<PermisType>("Permis A");
  const [date_examen, setDateExamen] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(b) => {
        onOpenChange(b);
        if (b) {
          setEleveId("");
          setExamType("Code");
          setTypePermis("Permis A");
          setDateExamen(new Date().toISOString().slice(0, 10));
          setNotes("");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrire à un examen</DialogTitle>
          <DialogDescription>Programmer une date d'examen pour un élève.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!eleve_id || !date_examen) {
              toast.error("Élève et date requis");
              return;
            }
            onSubmit({
              eleve_id,
              type_examen: exam_type,
              type_permis,
              date_examen,
              resultat: "en_attente",
              notes: notes || null,
              formation_id: null,
            });
          }}
          className="grid gap-4"
        >
          <div>
            <Label>Élève *</Label>
            <Select
              value={eleve_id}
              onValueChange={(v) => {
                setEleveId(v);
                const e = eleves.find((x) => x.id === v);
                if (e) setTypePermis(e.type_permis as PermisType);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un élève" />
              </SelectTrigger>
              <SelectContent>
                {eleves.length === 0 ? (
                  <SelectItem value="" disabled className="cursor-not-allowed text-muted-foreground">
                    Aucun élève disponible
                  </SelectItem>
                ) : (
                  eleves.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.prenom} {e.nom}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Type d'examen *</Label>
              <Select value={exam_type} onValueChange={(v) => setExamType(v as ExamType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type de permis *</Label>
              <Select
                value={type_permis}
                onValueChange={(v) => setTypePermis(v as PermisType)}
              >
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
          <div>
            <Label htmlFor="de">Date *</Label>
            <Input
              id="de"
              type="date"
              value={date_examen}
              onChange={(e) => setDateExamen(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="nt">Notes</Label>
            <Textarea
              id="nt"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="Centre d'examen, observations…"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Programmer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
