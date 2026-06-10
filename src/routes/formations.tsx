import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { Plus, GraduationCap, Pencil, Trash2, Power } from "lucide-react";
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
        title="Formations"
        description="Catalogue des formations proposées"
        actions={
          <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvelle formation
          </Button>
        }
      />

      {formations.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Aucune formation"
          description="Créez votre première formation."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formations.map((f) => (
            <Card
              key={f.id}
              className={`group p-5 transition-all hover:shadow-elegant ${!f.actif ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <Badge
                  variant={f.actif ? "default" : "secondary"}
                  className={f.actif ? "bg-success text-success-foreground" : ""}
                >
                  {f.actif ? "Active" : "Inactive"}
                </Badge>
              </div>
              <h3 className="mt-3 font-semibold">{f.nom}</h3>
              {f.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.description}</p>
              )}
              <p className="mt-3 text-2xl font-bold text-primary">{formatXOF(f.prix)}</p>
              <div className="mt-4 flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpen(f)}
                >
                  <Pencil className="mr-1 h-3 w-3" /> Modifier
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateFormation(f.id, { actif: !f.actif })}
                >
                  <Power className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm(`Supprimer la formation "${f.nom}" ?`)) {
                      deleteFormation(f.id);
                      toast.success("Formation supprimée");
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

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
            toast.success("Formation mise à jour");
          } else {
            await addFormation(data);
            toast.success("Formation créée");
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
