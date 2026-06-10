import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useShallow } from "zustand/shallow";
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
    useShallow((s) => ({
      planning_sessions: s.planning_sessions,
      moniteurs: s.moniteurs,
      eleves: s.eleves,
      addPlanningSession: s.addPlanningSession,
      updatePlanningSession: s.updatePlanningSession,
      deletePlanningSession: s.deletePlanningSession,
    })),
  );

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterMoniteur, setFilterMoniteur] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const editingSession = useMemo(
    () => planning_sessions.find((s) => s.id === editingId) || null,
    [planning_sessions, editingId],
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const moniteurMap = useMemo(
    () => new Map(moniteurs.map((moniteur) => [moniteur.id, moniteur])),
    [moniteurs],
  );

  const eleveMap = useMemo(() => new Map(eleves.map((eleve) => [eleve.id, eleve])), [eleves]);

  const stats = useMemo(() => {
    if (!isClient) return { total: planning_sessions.length, upcoming: 0, actifs: 0 };
    const now = new Date();
    const upcomingSessions = planning_sessions.filter((s) => new Date(s.date_heure) >= now);
    const actifs = new Set(upcomingSessions.filter((s) => s.moniteur_id).map((s) => s.moniteur_id))
      .size;
    return { total: planning_sessions.length, upcoming: upcomingSessions.length, actifs };
  }, [planning_sessions, isClient]);

  const filtered = useMemo(
    () =>
      planning_sessions.filter((s) => {
        const matchM = filterMoniteur === "all" || s.moniteur_id === filterMoniteur;
        const matchT = filterType === "all" || s.type === filterType;
        return matchM && matchT;
      }),
    [planning_sessions, filterMoniteur, filterType],
  );

  const handleOpen = useCallback((session?: PlanningSession) => {
    setEditingId(session?.id ?? null);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // CRITICAL: Delay clearing the data to allow Portal animation cleanup
    setTimeout(() => setEditingId(null), 300);
  }, []);

  const exportCsv = () => {
    try {
      const rows = [
        ["Titre", "Moniteur", "Élève", "Date / Heure", "Durée", "Type", "Lieu"],
        ...filtered.map((s) => {
          const m = moniteurMap.get(s.moniteur_id ?? "");
          const e = eleveMap.get(s.eleve_id ?? "");
          return [
            s.titre,
            m ? `${m.prenom} ${m.nom}` : "-",
            e ? `${e.prenom} ${e.nom}` : "-",
            new Date(s.date_heure).toLocaleString("fr-FR"),
            `${s.duree_minutes} min`,
            s.type,
            s.lieu || "-",
          ];
        }),
      ];
      downloadCsv(rows, `planning-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (e) {
      toast.error("Export impossible");
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
            <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>À venir</CardTitle>
            <CardDescription>Sessions prochaines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-100">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Moniteurs actifs</CardTitle>
            <CardDescription>Mobilisés cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-100">{stats.actifs}</p>
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
          <Select value={filterMoniteur} onValueChange={setFilterMoniteur}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les moniteurs</SelectItem>
              {moniteurs.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.prenom} {m.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              {SESSION_TYPES.map((t) => (
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
            icon={CalendarDays}
            title={planning_sessions.length === 0 ? "Aucune session" : "Aucun résultat"}
            description={
              planning_sessions.length === 0
                ? "Planifiez votre premier cours."
                : "Ajustez vos filtres."
            }
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((s) => {
              const m = moniteurMap.get(s.moniteur_id ?? "");
              const e = eleveMap.get(s.eleve_id ?? "");
              return (
                <Card key={s.id} className="p-4 transition-all hover:shadow-elegant">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{s.titre}</p>
                      <p className="text-xs text-muted-foreground">{s.type}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                      {isClient
                        ? new Date(s.date_heure).toLocaleString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "..."}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                    <p>
                      <span className="font-semibold text-slate-200">Moniteur:</span>{" "}
                      {m ? `${m.prenom} ${m.nom}` : "Aucun"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-200">Élève:</span>{" "}
                      {e ? `${e.prenom} ${e.nom}` : "Aucun"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-200">Durée:</span> {s.duree_minutes}{" "}
                      min
                    </p>
                    <p>
                      <span className="font-semibold text-slate-200">Lieu:</span>{" "}
                      {s.lieu || "Non défini"}
                    </p>
                    {s.notes && (
                      <p className="italic text-xs border-l-2 border-primary/20 pl-2 mt-1">
                        {s.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                    <Button size="sm" variant="outline" onClick={() => handleOpen(s)}>
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Supprimer ?")) {
                          deletePlanningSession(s.id);
                          toast.success("Supprimée");
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
      </div>

      <SessionDialog
        key={editingId || "new"}
        open={open}
        onOpenChange={(val) => {
          if (!val) handleClose();
          else setOpen(true);
        }}
        editing={editingSession}
        moniteurs={moniteurs}
        eleves={eleves}
        onSubmit={async (data) => {
          const cleanData = {
            ...data,
            moniteur_id: data.moniteur_id === "none" ? null : data.moniteur_id,
            eleve_id: data.eleve_id === "none" ? null : data.eleve_id,
          };
          if (editingId) {
            await updatePlanningSession(editingId, cleanData);
            toast.success("Mise à jour effectuée");
          } else {
            await addPlanningSession(cleanData);
            toast.success("Session ajoutée");
          }
          handleClose();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<SessionForm>({
    titre: "",
    eleve_id: "none",
    moniteur_id: "none",
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
              eleve_id: editing.eleve_id ?? "none",
              moniteur_id: editing.moniteur_id ?? "none",
              date_heure: editing.date_heure,
              duree_minutes: editing.duree_minutes,
              lieu: editing.lieu ?? "",
              type: editing.type,
              notes: editing.notes ?? "",
            }
          : {
              titre: "",
              eleve_id: "none",
              moniteur_id: "none",
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
          <DialogDescription>Planifiez une session de formation ou un examen.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto px-1">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.titre.trim() || !form.date_heure.trim()) {
                toast.error("Titre et date/heure sont requis");
                return;
              }
              setIsSubmitting(true);
              try {
                await onSubmit(form);
              } catch (err) {
                toast.error("Erreur technique");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="grid gap-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Moniteur</Label>
                <Select
                  value={form.moniteur_id}
                  onValueChange={(v) => setForm({ ...form, moniteur_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {moniteurs.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.prenom} {m.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Élève</Label>
                <Select
                  value={form.eleve_id}
                  onValueChange={(v) => setForm({ ...form, eleve_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {eleves.map((el) => (
                      <SelectItem key={el.id} value={el.id}>
                        {el.prenom} {el.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_heure">Date / heure *</Label>
                <Input
                  id="date_heure"
                  type="datetime-local"
                  value={form.date_heure}
                  onChange={(e) => setForm({ ...form, date_heure: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duree_minutes">Durée (min)</Label>
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
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  id="lieu"
                  value={form.lieu}
                  onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
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
                {isSubmitting ? "En cours..." : editing ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
