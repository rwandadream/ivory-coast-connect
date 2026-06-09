import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Users, Pencil, Trash2 } from "lucide-react";
import { useStore, formatTel, type Moniteur } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TelInput } from "@/components/TelInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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

export const Route = createFileRoute("/moniteurs")({
  head: () => ({ meta: [{ title: "Moniteurs — SARAH AUTO" }] }),
  component: MoniteursPage,
});

const STATUTS = ["Disponible", "En mission", "Absent"] as const;

type MoniteurForm = {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  specialite: string;
  statut: string;
};

function MoniteursPage() {
  const { moniteurs, addMoniteur, updateMoniteur, deleteMoniteur } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Moniteur | null>(null);

  const totalMoniteurs = moniteurs.length;
  const disponibles = useMemo(
    () => moniteurs.filter((m) => m.statut === "Disponible").length,
    [moniteurs],
  );
  const enMission = useMemo(
    () => moniteurs.filter((m) => m.statut === "En mission").length,
    [moniteurs],
  );

  const handleOpen = (moniteur?: Moniteur) => {
    setEditing(moniteur ?? null);
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Moniteurs"
        description={`${totalMoniteurs} moniteur${totalMoniteurs > 1 ? "s" : ""} enregistré${totalMoniteurs > 1 ? "s" : ""}`}
        actions={
          <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouveau moniteur
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card/70 shadow-sm">
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Total</p>
            <p className="mt-4 text-4xl font-semibold">{totalMoniteurs}</p>
          </div>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Disponibles</p>
            <p className="mt-4 text-4xl font-semibold">{disponibles}</p>
          </div>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">En mission</p>
            <p className="mt-4 text-4xl font-semibold">{enMission}</p>
          </div>
        </Card>
        <div className="hidden xl:block" />
      </div>

      {moniteurs.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun moniteur"
          description="Ajoutez vos moniteurs pour planifier les cours et les examens."
          action={
            <Button onClick={() => handleOpen()}>
              <Plus className="mr-1 h-4 w-4" /> Ajouter un moniteur
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {moniteurs.map((moniteur) => (
            <Card key={moniteur.id} className="p-4 transition-all hover:shadow-elegant">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-100">
                    {moniteur.prenom} {moniteur.nom}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {moniteur.specialite || "General"}
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  {moniteur.statut}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>{formatTel(moniteur.telephone)}</p>
                {moniteur.email && <p>{moniteur.email}</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handleOpen(moniteur)}>
                  <Pencil className="mr-1 h-3 w-3" /> Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Supprimer ${moniteur.prenom} ${moniteur.nom} ?`)) {
                      deleteMoniteur(moniteur.id);
                      toast.success("Moniteur supprimé");
                    }
                  }}
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MoniteurDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSubmit={async (data) => {
          if (editing) {
            await updateMoniteur(editing.id, data);
            toast.success("Moniteur mis à jour");
          } else {
            await addMoniteur(data);
            toast.success("Moniteur ajouté");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function MoniteurDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Moniteur | null;
  onSubmit: (data: MoniteurForm) => Promise<void>;
}) {
  const [form, setForm] = useState<MoniteurForm>({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    specialite: "",
    statut: "Disponible",
  });

  useEffect(() => {
    if (open) {
      setForm(
        editing
          ? {
              nom: editing.nom,
              prenom: editing.prenom,
              telephone: editing.telephone,
              email: editing.email ?? "",
              specialite: editing.specialite ?? "",
              statut: editing.statut,
            }
          : {
              nom: "",
              prenom: "",
              telephone: "",
              email: "",
              specialite: "",
              statut: "Disponible",
            },
      );
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier le moniteur" : "Nouveau moniteur"}</DialogTitle>
          <DialogDescription>Enregistrez les informations de votre moniteur.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.nom.trim() || !form.prenom.trim() || !form.telephone.trim()) {
              toast.error("Nom, prénom et téléphone sont requis");
              return;
            }
            await onSubmit(form);
          }}
          className="grid gap-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="telephone">Téléphone *</Label>
            <TelInput
              id="telephone"
              value={form.telephone}
              onChange={(value) => setForm({ ...form, telephone: value })}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="specialite">Spécialité</Label>
              <Input
                id="specialite"
                value={form.specialite}
                onChange={(e) => setForm({ ...form, specialite: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Statut</Label>
            <Select
              value={form.statut}
              onValueChange={(value) => setForm({ ...form, statut: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUTS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
