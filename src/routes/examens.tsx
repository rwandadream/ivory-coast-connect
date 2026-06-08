import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ClipboardCheck, Trash2, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import { useStore, labelResultat, type ResultatExamen, type Examen } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/examens")({
  head: () => ({ meta: [{ title: "Examens — SARRAH AUTO" }] }),
  component: ExamensPage,
});

const TYPES_PERMIS = ["Permis B", "Permis A", "Permis C", "Permis D", "Code de la route"];

function ExamensPage() {
  const { examens, eleves, addExamen, updateExamen, deleteExamen } = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ResultatExamen | "all">("all");

  const filtered = filter === "all" ? examens : examens.filter((e) => e.resultat === filter);

  return (
    <div>
      <PageHeader
        title="Examens"
        description={`${examens.length} examen${examens.length > 1 ? "s" : ""} enregistré${examens.length > 1 ? "s" : ""}`}
        actions={
          <Button onClick={() => setOpen(true)} className="bg-gradient-primary shadow-glow" disabled={eleves.length === 0}>
            <Plus className="mr-1 h-4 w-4" /> Inscrire à un examen
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="admis">Admis</SelectItem>
            <SelectItem value="echec">Échec</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={examens.length === 0 ? "Aucun examen" : "Aucun résultat"}
          description={eleves.length === 0 ? "Créez un élève avant de programmer un examen." : "Inscrivez un élève à un examen."}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => {
            const eleve = eleves.find((e) => e.id === ex.eleveId);
            const statutMeta = {
              en_attente: { icon: Clock, color: "bg-warning/20 text-warning-foreground border-warning/40" },
              admis: { icon: CheckCircle2, color: "bg-success/15 text-success border-success/30" },
              echec: { icon: XCircle, color: "bg-destructive/15 text-destructive border-destructive/30" },
            }[ex.resultat];
            const Icon = statutMeta.icon;
            return (
              <Card key={ex.id} className="p-4 transition-all hover:shadow-elegant">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}</p>
                    <p className="text-xs text-muted-foreground">{ex.typePermis}</p>
                  </div>
                  <Badge variant="outline" className={statutMeta.color}>
                    <Icon className="mr-1 h-3 w-3" /> {labelResultat(ex.resultat)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm">📅 {new Date(ex.dateExamen).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                {ex.notes && <p className="mt-2 text-xs text-muted-foreground italic">{ex.notes}</p>}
                <div className="mt-4 flex gap-1.5">
                  {ex.resultat === "en_attente" && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1 text-success hover:bg-success/10" onClick={() => { updateExamen(ex.id, { resultat: "admis" }); toast.success("Marqué admis"); }}>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Admis
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive hover:bg-destructive/10" onClick={() => { updateExamen(ex.id, { resultat: "echec" }); toast.success("Marqué échec"); }}>
                        <XCircle className="mr-1 h-3 w-3" /> Échec
                      </Button>
                    </>
                  )}
                  {ex.resultat !== "en_attente" && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => updateExamen(ex.id, { resultat: "en_attente" })}>
                      <Clock className="mr-1 h-3 w-3" /> Remettre en attente
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer cet examen ?")) { deleteExamen(ex.id); toast.success("Examen supprimé"); }
                  }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ExamenDialog open={open} onOpenChange={setOpen} onSubmit={(data) => {
        addExamen(data);
        toast.success("Examen programmé");
        setOpen(false);
      }} />
    </div>
  );
}

function ExamenDialog({
  open, onOpenChange, onSubmit,
}: {
  open: boolean; onOpenChange: (b: boolean) => void;
  onSubmit: (d: Omit<Examen, "id" | "createdAt">) => void;
}) {
  const { eleves } = useStore();
  const [eleveId, setEleveId] = useState("");
  const [typePermis, setTypePermis] = useState("Permis B");
  const [dateExamen, setDateExamen] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  return (
    <Dialog open={open} onOpenChange={(b) => {
      onOpenChange(b);
      if (b) { setEleveId(""); setTypePermis("Permis B"); setDateExamen(new Date().toISOString().slice(0, 10)); setNotes(""); }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrire à un examen</DialogTitle>
          <DialogDescription>Programmer une date d'examen pour un élève.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!eleveId || !dateExamen) { toast.error("Élève et date requis"); return; }
          const eleve = eleves.find((x) => x.id === eleveId);
          onSubmit({ eleveId, typePermis, dateExamen, resultat: "en_attente", notes: notes || undefined, formationId: undefined });
        }} className="grid gap-4">
          <div>
            <Label>Élève *</Label>
            <Select value={eleveId} onValueChange={(v) => {
              setEleveId(v);
              const e = eleves.find((x) => x.id === v);
              if (e) setTypePermis(e.typePermis);
            }}>
              <SelectTrigger><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
              <SelectContent>
                {eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.prenom} {e.nom}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Type d'examen *</Label>
              <Select value={typePermis} onValueChange={setTypePermis}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES_PERMIS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="de">Date *</Label>
              <Input id="de" type="date" value={dateExamen} onChange={(e) => setDateExamen(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label htmlFor="nt">Notes</Label>
            <Textarea id="nt" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={2} placeholder="Centre d'examen, observations…" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-gradient-primary">Programmer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
