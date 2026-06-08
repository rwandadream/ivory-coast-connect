import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, Phone, Mail } from "lucide-react";
import { useStore, formatTel, type Eleve } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TelInput } from "@/components/TelInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/eleves")({
  head: () => ({ meta: [{ title: "Élèves — SARRAH AUTO" }] }),
  component: ElevesPage,
});

const TYPES_PERMIS = ["Permis B", "Permis A", "Permis C", "Permis D", "Code uniquement"];

function ElevesPage() {
  const { eleves, addEleve, updateEleve, deleteEleve } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Eleve | null>(null);

  const filtered = eleves.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.nom.toLowerCase().includes(q) ||
      e.prenom.toLowerCase().includes(q) ||
      e.telephone.includes(search) ||
      e.email?.toLowerCase().includes(q)
    );
  });

  const handleOpen = (e?: Eleve) => {
    setEditing(e ?? null);
    setOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Élèves"
        description={`${eleves.length} élève${eleves.length > 1 ? "s" : ""} enregistré${eleves.length > 1 ? "s" : ""}`}
        actions={
          <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvel élève
          </Button>
        }
      />

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone, email…"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={eleves.length === 0 ? "Aucun élève" : "Aucun résultat"}
          description={eleves.length === 0 ? "Commencez par enregistrer votre premier élève." : "Essayez une autre recherche."}
          action={eleves.length === 0 ? (
            <Button onClick={() => handleOpen()}><Plus className="mr-1 h-4 w-4" /> Ajouter un élève</Button>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Card key={e.id} className="group p-4 transition-all hover:shadow-elegant">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary font-semibold text-primary-foreground">
                  {e.prenom[0]}{e.nom[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{e.prenom} {e.nom}</p>
                      <Badge variant="secondary" className="mt-0.5 text-[10px]">{e.typePermis}</Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpen(e)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => {
                        if (confirm(`Supprimer ${e.prenom} ${e.nom} et toutes ses données associées ?`)) {
                          deleteEleve(e.id);
                          toast.success("Élève supprimé");
                        }
                      }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {formatTel(e.telephone)}</p>
                    {e.email && <p className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3" /> {e.email}</p>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <EleveDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSubmit={(data) => {
          if (editing) {
            updateEleve(editing.id, data);
            toast.success("Élève mis à jour");
          } else {
            addEleve(data);
            toast.success("Élève ajouté");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function EleveDialog({
  open, onOpenChange, editing, onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  editing: Eleve | null;
  onSubmit: (data: Omit<Eleve, "id" | "createdAt">) => void;
}) {
  const [form, setForm] = useState<Omit<Eleve, "id" | "createdAt">>({
    nom: "", prenom: "", telephone: "", email: "", adresse: "",
    dateNaissance: "", typePermis: "Permis B", dateInscription: new Date().toISOString().slice(0, 10),
  });

  // sync when editing changes
  useState(() => {
    if (editing) setForm(editing);
  });

  return (
    <Dialog open={open} onOpenChange={(b) => {
      onOpenChange(b);
      if (b) {
        setForm(editing ?? {
          nom: "", prenom: "", telephone: "", email: "", adresse: "",
          dateNaissance: "", typePermis: "Permis B", dateInscription: new Date().toISOString().slice(0, 10),
        });
      }
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier l'élève" : "Nouvel élève"}</DialogTitle>
          <DialogDescription>Renseignez les informations de l'élève.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.nom.trim() || !form.prenom.trim() || !form.telephone.trim()) {
              toast.error("Nom, prénom et téléphone sont requis");
              return;
            }
            onSubmit(form);
          }}
          className="grid gap-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input id="prenom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required maxLength={50} />
            </div>
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input id="nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required maxLength={50} />
            </div>
          </div>
          <div>
            <Label htmlFor="tel">Téléphone *</Label>
            <TelInput id="tel" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={120} />
            </div>
            <div>
              <Label htmlFor="dn">Date de naissance</Label>
              <Input id="dn" type="date" value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Input id="adresse" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} maxLength={200} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Type de permis *</Label>
              <Select value={form.typePermis} onValueChange={(v) => setForm({ ...form, typePermis: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES_PERMIS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="di">Date d'inscription *</Label>
              <Input id="di" type="date" value={form.dateInscription} onChange={(e) => setForm({ ...form, dateInscription: e.target.value })} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-gradient-primary">{editing ? "Mettre à jour" : "Enregistrer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
