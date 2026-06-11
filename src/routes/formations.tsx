import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { Plus, Car, Pencil, Trash2, Power } from "lucide-react";
import { useStore, formatXOF, type Formation } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/formations")({
  head: () => ({ meta: [{ title: "Formations — SARAH AUTO" }] }),
  component: FormationsPage,
});

function FormationsPage() {
  const { formations, addFormation, updateFormation, deleteFormation } = useStore(
    useShallow((s) => ({
      formations: s.formations,
      addFormation: s.addFormation,
      updateFormation: s.updateFormation,
      deleteFormation: s.deleteFormation,
    })),
  );

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingFormation = useMemo(
    () => formations.find((f) => f.id === editingId) || null,
    [formations, editingId],
  );

  const handleOpen = useCallback((f?: Formation) => {
    setEditingId(f?.id ?? null);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => setEditingId(null), 300);
  }, []);

  return (
    <div>
      <PageHeader
        title="Tarifs des Permis"
        description="Gérez les prix forfaitaires par type de permis (inclut Code + Conduite)"
        actions={
          <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouveau Permis
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formations.map((f) => (
          <Card
            key={f.id}
            className={`group relative overflow-hidden p-6 transition-all hover:shadow-elegant ${!f.actif ? "opacity-60" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={f.actif ? "default" : "secondary"}
                  className={f.actif ? "bg-success text-success-foreground" : ""}
                >
                  {f.actif ? "Actif" : "Désactivé"}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    if (confirm(`Supprimer le ${f.nom} ?`)) {
                      deleteFormation(f.id);
                      toast.success("Catégorie supprimée");
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h3 className="mt-4 text-xl font-bold">{f.nom}</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {f.description || "Forfait complet Code + Conduite"}
            </p>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Tarif Forfaitaire
              </p>
              <p className="mt-1 text-3xl font-black text-primary">{formatXOF(f.prix)}</p>
            </div>

            <div className="mt-6 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpen(f)}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9"
                onClick={() => updateFormation(f.id, { actif: !f.actif })}
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <FormationDialog
        key={editingId || "new"}
        open={open}
        onOpenChange={(val) => {
          if (!val) handleClose();
          else setOpen(true);
        }}
        editing={editingFormation}
        onSubmit={async (data) => {
          if (editingId) {
            await updateFormation(editingId, data);
            toast.success("Tarif mis à jour");
          } else {
            await addFormation(data);
            toast.success("Nouveau type de permis créé");
          }
          handleClose();
        }}
      />
    </div>
  );
}

function FormationDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  editing: Formation | null;
  onSubmit: (d: Omit<Formation, "id" | "created_at">) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Omit<Formation, "id" | "created_at">>({
    nom: "",
    description: "",
    prix: 0,
    actif: true,
  });

  useEffect(() => {
    if (open) {
      setForm(
        editing
          ? {
              nom: editing.nom,
              description: editing.description || "",
              prix: editing.prix,
              actif: editing.actif,
            }
          : { nom: "", description: "", prix: 0, actif: true },
      );
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
          <DialogDescription>Définissez le nom, le tarif et la description.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.nom.trim() || form.prix < 0) {
              toast.error("Nom et tarif requis");
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
          className="grid gap-4"
        >
          <div>
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={300}
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="prix">Tarif (FCFA) *</Label>
            <MoneyInput
              id="prix"
              value={form.prix}
              onValueChange={(value: number) => setForm({ ...form, prix: value })}
              placeholder="0"
              min={0}
              max={999999999999}
              required
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Formation active</p>
              <p className="text-xs text-muted-foreground">
                Disponible pour les nouvelles inscriptions
              </p>
            </div>
            <Switch checked={form.actif} onCheckedChange={(c) => setForm({ ...form, actif: c })} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : editing ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
