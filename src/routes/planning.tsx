import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import { Plus, CalendarDays, Filter, Download } from "lucide-react";
import { useStore, type PlanningSession, type Moniteur, type Eleve } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { cn, downloadCsv } from "@/lib/utils";
import { toast } from "sonner";

const SESSION_TYPES = ["Cours", "Examen", "Rendez-vous"] as const;

type SessionForm = {
  titre: string;
  eleve_id: string;
  moniteur_id: string;
  date_heure: string;
  duree_minutes: number;
  lieu: string;
  type: string;
  notes: string;
};

export const Route = createFileRoute("/planning")({
  head: () => ({ meta: [{ title: "Planning — SARAH AUTO" }] }),
  component: PlanningPage,
});

function PlanningPage() {
  const {
    planning_sessions,
    moniteurs,
    eleves,
    addPlanningSession,
    updatePlanningSession,
    deletePlanningSession,
  } = useStore(
    (s) => ({
      planning_sessions: s.planning_sessions,
      moniteurs: s.moniteurs,
      eleves: s.eleves,
      addPlanningSession: s.addPlanningSession,
      updatePlanningSession: s.updatePlanningSession,
      deletePlanningSession: s.deletePlanningSession,
    }),
    shallow,
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlanningSession | null>(null);
  const [filterMoniteur, setFilterMoniteur] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const moniteurMap = useMemo(
    () => new Map(moniteurs.map((moniteur) => [moniteur.id, moniteur])),
    [moniteurs],
  );

  const eleveMap = useMemo(
    () => new Map(eleves.map((eleve) => [eleve.id, eleve])),
    [eleves],
  );

  const upcoming = useMemo(
    () => planning_sessions.filter((session) => new Date(session.date_heure) >= new Date()),
    [planning_sessions],
  );

  const filtered = useMemo(
    () =>
      planning_sessions.filter((session) => {
        const matchesMoniteur = filterMoniteur === "all" || session.moniteur_id === filterMoniteur;
        const matchesType = filterType === "all" || session.type === filterType;
        return matchesMoniteur && matchesType;
      }),
    [planning_sessions, filterMoniteur, filterType],
  );

  const nextSession = useMemo(() => {
    const sorted = [...upcoming].sort((a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
    return sorted[0] ?? null;
  }, [upcoming]);

  const moniteursActifs = useMemo(
    () => new Set(upcoming.filter((session) => session.moniteur_id).map((session) => session.moniteur_id)).size,
    [upcoming],
  );

  const handleOpen = (session?: PlanningSession) => {
    setEditing(session ?? null);
    setOpen(true);
  };

  const exportCsv = () => {
    try {
      const rows = [
        ["Titre", "Moniteur", "Élève", "Date / Heure", "Durée", "Type", "Lieu"],
        ...filtered.map((session) => {
          const moniteur = moniteurMap.get(session.moniteur_id ?? "") ?? null;
          const eleve = eleveMap.get(session.eleve_id ?? "") ?? null;
          return [
            session.titre,
            moniteur ? `${moniteur.prenom} ${moniteur.nom}` : "-",
            eleve ? `${eleve.prenom} ${eleve.nom}` : "-",
            new Date(session.date_heure).toLocaleString("fr-FR"),
            `${session.duree_minutes} min`,
            session.type,
            session.lieu || "-",
          ];
        }),
      ];

      downloadCsv(rows, `planning-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      toast.error("Impossible d'exporter le planning.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Planning"
        description="Organisez les sessions de formation, rendez-vous et examens."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
              <Plus className="mr-1 h-4 w-4" /> Nouvelle session
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 flex items-center"
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              <Download className="h-4 w-4" /> Exporter
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Total</CardTitle>
            <CardDescription>Sessions planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{planning_sessions.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>À venir</CardTitle>
            <CardDescription>Sessions prochaines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcoming.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Moniteurs actifs</CardTitle>
            <CardDescription>Mobilisés cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{moniteursActifs}</p>
          </CardContent>
        </Card>
        <div className="hidden xl:block" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_auto] items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtrer</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select value={filterMoniteur} onValueChange={(value) => setFilterMoniteur(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les moniteurs</SelectItem>
              {moniteurs.map((moniteur) => (
                <SelectItem key={moniteur.id} value={moniteur.id}>
                  {moniteur.prenom} {moniteur.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              {SESSION_TYPES.map((type) => (
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
          icon={CalendarDays}
          title={planning_sessions.length === 0 ? "Aucune session" : "Aucun résultat"}
          description={
            planning_sessions.length === 0
              ? "Planifiez votre premier cours, rendez-vous ou examen."
              : "Ajustez vos filtres pour voir les sessions."
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((session) => {
            const moniteur = moniteurMap.get(session.moniteur_id ?? "") ?? null;
            const eleve = eleveMap.get(session.eleve_id ?? "") ?? null;
            return (
              <Card key={session.id} className="p-4 transition-all hover:shadow-elegant">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{session.titre}</p>
                    <p className="text-xs text-muted-foreground">{session.type}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                    {new Date(session.date_heure).toLocaleString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-slate-100">Moniteur:</span> {moniteur ? `${moniteur.prenom} ${moniteur.nom}` : "Aucun"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Élève:</span> {eleve ? `${eleve.prenom} ${eleve.nom}` : "Aucun"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Durée:</span> {session.duree_minutes} min
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Lieu:</span> {session.lieu || "Non défini"}
                  </p>
                  {session.notes && <p className="italic">{session.notes}</p>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpen(session)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Supprimer cette session ?")) {
                        deletePlanningSession(session.id);
                        toast.success("Session supprimée");
                      }
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <SessionDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        moniteurs={moniteurs}
        eleves={eleves}
        onSubmit={async (data) => {
          if (editing) {
            await updatePlanningSession(editing.id, data);
            toast.success("Session mise à jour");
          } else {
            await addPlanningSession(data);
            toast.success("Session ajoutée");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function SessionDialog({
  open,
  onOpenChange,
  editing,
  moniteurs,
  eleves,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: PlanningSession | null;
  moniteurs: Moniteur[];
  eleves: Eleve[];
  onSubmit: (data: SessionForm) => Promise<void>;
}) {
  const [form, setForm] = useState<SessionForm>({
    titre: "",
    eleve_id: "",
    moniteur_id: "",
    date_heure: new Date().toISOString().slice(0, 16),
    duree_minutes: 60,
    lieu: "",
    type: "Cours",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setForm(
        editing
          ? {
              titre: editing.titre,
              eleve_id: editing.eleve_id ?? "",
              moniteur_id: editing.moniteur_id ?? "",
              date_heure: editing.date_heure,
              duree_minutes: editing.duree_minutes,
              lieu: editing.lieu ?? "",
              type: editing.type,
              notes: editing.notes ?? "",
            }
          : {
              titre: "",
              eleve_id: "",
              moniteur_id: "",
              date_heure: new Date().toISOString().slice(0, 16),
              duree_minutes: 60,
              lieu: "",
              type: "Cours",
              notes: "",
            },
      );
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
          <DialogDescription>Planifiez une session de formation ou un examen.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.titre.trim() || !form.date_heure.trim()) {
              toast.error("Titre et date/heure sont requis");
              return;
            }
            await onSubmit(form);
          }}
          className="grid gap-4"
        >
          <div>
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Moniteur</Label>
              <Select
                value={form.moniteur_id}
                onValueChange={(value) => setForm({ ...form, moniteur_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un moniteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {moniteurs.map((moniteur) => (
                    <SelectItem key={moniteur.id} value={moniteur.id}>
                      {moniteur.prenom} {moniteur.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Élève</Label>
              <Select
                value={form.eleve_id}
                onValueChange={(value) => setForm({ ...form, eleve_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un élève" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {eleves.map((eleve) => (
                    <SelectItem key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="date_heure">Date / heure *</Label>
              <Input
                id="date_heure"
                type="datetime-local"
                value={form.date_heure}
                onChange={(e) => setForm({ ...form, date_heure: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="duree_minutes">Durée (minutes)</Label>
              <Input
                id="duree_minutes"
                type="number"
                min={15}
                step={15}
                value={form.duree_minutes}
                onChange={(e) => setForm({ ...form, duree_minutes: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TYPES.map((sessionType) => (
                    <SelectItem key={sessionType} value={sessionType}>
                      {sessionType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lieu">Lieu</Label>
              <Input
                id="lieu"
                value={form.lieu}
                onChange={(e) => setForm({ ...form, lieu: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {editing ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
