import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import { Plus, Search, Pencil, Trash2, Users, Phone, Mail, Eye } from "lucide-react";
import { useStore, formatXOF, formatTel, type Eleve } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TelInput } from "@/components/TelInput";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/eleves")({
  head: () => ({ meta: [{ title: "Élèves — SARAH AUTO" }] }),
  component: ElevesPage,
});

const TYPES_PERMIS = ["A", "B", "AB", "BCDE", "ABCD"];

type EleveForm = {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  date_naissance: string;
  type_permis: string;
  date_inscription: string;
};

function ElevesPage() {
  const { eleves, factures, paiements, examens, addEleve, updateEleve, deleteEleve } = useStore(
    (s) => ({
      eleves: s.eleves,
      factures: s.factures,
      paiements: s.paiements,
      examens: s.examens,
      addEleve: s.addEleve,
      updateEleve: s.updateEleve,
      deleteEleve: s.deleteEleve,
    }),
    shallow,
  );
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Eleve | null>(null);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return eleves.filter((e) =>
      e.nom.toLowerCase().includes(q) ||
      e.prenom.toLowerCase().includes(q) ||
      e.telephone.includes(search) ||
      e.email?.toLowerCase().includes(q),
    );
  }, [eleves, search]);

  const handleOpen = useCallback((e?: Eleve) => {
    setEditing(e ?? null);
    setOpen(true);
  }, []);

  const permisCounts = useMemo(
    () =>
      TYPES_PERMIS.map((type) => ({
        type,
        count: eleves.filter((e) => e.type_permis === type).length,
      })),
    [eleves],
  );
  const nouveauxCeMois = useMemo(
    () =>
      eleves.filter((e) => new Date(e.created_at).getMonth() === new Date().getMonth()).length,
    [eleves],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Élèves"
        description={`${eleves.length} élève${eleves.length > 1 ? "s" : ""} enregistré${eleves.length > 1 ? "s" : ""}`}
        actions={
          <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvel élève
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Total</CardTitle>
            <CardDescription>Élèves enregistrés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{eleves.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Nouveau ce mois</CardTitle>
            <CardDescription>Inscrits ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {eleves.filter((e) => new Date(e.created_at).getMonth() === new Date().getMonth()).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Permis le plus demandé</CardTitle>
            <CardDescription>Préférence actuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {permisCounts.sort((a, b) => b.count - a.count)[0]?.type ?? "-"}
            </p>
          </CardContent>
        </Card>
        <div className="hidden xl:block" />
      </div>

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
          description={
            eleves.length === 0
              ? "Commencez par enregistrer votre premier élève."
              : "Essayez une autre recherche."
          }
          action={
            eleves.length === 0 ? (
              <Button onClick={() => handleOpen()}>
                <Plus className="mr-1 h-4 w-4" /> Ajouter un élève
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Card key={e.id} className="group p-4 transition-all hover:shadow-elegant">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary font-semibold text-primary-foreground">
                  {e.prenom[0]}
                  {e.nom[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {e.prenom} {e.nom}
                      </p>
                      <Badge variant="secondary" className="mt-0.5 text-[10px]">
                        {e.type_permis}
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleOpen(e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => {
                          if (
                            confirm(
                              `Supprimer ${e.prenom} ${e.nom} et toutes ses données associées ?`,
                            )
                          ) {
                            deleteEleve(e.id);
                            toast.success("Élève supprimé");
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> {formatTel(e.telephone)}
                    </p>
                    {e.email && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3" /> {e.email}
                      </p>
                    )}
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Dossier {e.dossier_code}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Statut {e.statut}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedEleve(e)}>
                  <Eye className="mr-1 h-3.5 w-3.5" /> Voir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpen(e)}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (
                      confirm(
                        `Supprimer ${e.prenom} ${e.nom} et toutes ses données associées ?`,
                      )
                    ) {
                      deleteEleve(e.id);
                      toast.success("Élève supprimé");
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

      <EleveDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSubmit={async (data) => {
          if (editing) {
            await updateEleve(editing.id, data);
            toast.success("Élève mis à jour");
          } else {
            await addEleve(data);
            toast.success("Élève ajouté");
          }
          setOpen(false);
        }}
      />

      <EleveDetailsDialog eleve={selectedEleve} onClose={() => setSelectedEleve(null)} />
    </div>
  );
}

function EleveDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  editing: Eleve | null;
  onSubmit: (data: EleveForm) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EleveForm>({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    date_naissance: "",
    type_permis: "B",
    date_inscription: "",
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
              adresse: editing.adresse ?? "",
              date_naissance: editing.date_naissance ?? "",
              type_permis: editing.type_permis,
              date_inscription: editing.date_inscription ?? "",
            }
          : {
              nom: "",
              prenom: "",
              telephone: "",
              email: "",
              adresse: "",
              date_naissance: "",
              type_permis: "B",
              date_inscription: "",
            },
      );
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier l'élève" : "Nouvel élève"}</DialogTitle>
          <DialogDescription>Renseignez les informations de l'élève.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.nom.trim() || !form.prenom.trim() || !form.telephone.trim()) {
              toast.error("Nom, prénom et téléphone sont requis");
              return;
            }
            setIsSubmitting(true);
            try {
              await onSubmit(form);
            } finally {
              setIsSubmitting(false);
            }
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
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
                maxLength={50}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="tel">Téléphone *</Label>
            <TelInput
              id="tel"
              value={form.telephone}
              onChange={(v) => setForm({ ...form, telephone: v })}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={120}
              />
            </div>
            <div>
              <Label htmlFor="dn">Date de naissance</Label>
              <Input
                id="dn"
                type="date"
                value={form.date_naissance || ""}
                onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={form.adresse || ""}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              maxLength={200}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Type de permis *</Label>
              <Select
                value={form.type_permis}
                onValueChange={(v) => setForm({ ...form, type_permis: v })}
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
            <div>
              <Label htmlFor="di">Date d'inscription *</Label>
              <Input
                id="di"
                type="date"
                value={form.date_inscription || ""}
                onChange={(e) => setForm({ ...form, date_inscription: e.target.value })}
                required
              />
            </div>
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
              {isSubmitting ? "Chargement..." : editing ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EleveDetailsDialog({
  eleve,
  onClose,
}: {
  eleve: Eleve | null;
  onClose: () => void;
}) {
  const { factures, paiements, examens, inscriptions, formations, getMontantPaye, getStatutFacture } = useStore(
    (s) => ({
      factures: s.factures,
      paiements: s.paiements,
      examens: s.examens,
      inscriptions: s.inscriptions,
      formations: s.formations,
      getMontantPaye: s.getMontantPaye,
      getStatutFacture: s.getStatutFacture,
    }),
    shallow,
  );

  if (!eleve) return null;

  const eleveFactures = factures.filter((f) => f.eleve_id === eleve.id);
  const elevePaiements = paiements.filter((p) => p.eleve_id === eleve.id);
  const eleveExamens = examens.filter((x) => x.eleve_id === eleve.id);
  const eleveInscription = inscriptions.find((i) => i.eleve_id === eleve.id);
  const formation = eleveInscription ? formations.find((f) => f.id === eleveInscription.formation_id) : null;

  return (
    <Dialog open={!!eleve} onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Fiche de l'élève</DialogTitle>
          <DialogDescription>Suivez les factures, paiements et examens associés.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Élève</p>
                <p className="text-2xl font-semibold">{eleve.prenom} {eleve.nom}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/eleves"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "inline-flex items-center justify-center",
                  )}
                >
                  Retour aux élèves
                </Link>
                <Button size="sm" variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Téléphone</p>
                <p className="mt-1 text-sm font-medium">{formatTel(eleve.telephone)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</p>
                <p className="mt-1 text-sm font-medium">{eleve.email || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Type de permis</p>
                <p className="mt-1 text-sm font-medium">{eleve.type_permis}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Factures</p>
                <p className="mt-2 text-2xl font-semibold">{eleveFactures.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paiements</p>
                <p className="mt-2 text-2xl font-semibold">{elevePaiements.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Examens</p>
                <p className="mt-2 text-2xl font-semibold">{eleveExamens.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Formation</p>
                <p className="mt-2 text-sm font-semibold">{formation?.nom || "Aucune"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Factures</p>
              {eleveFactures.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Aucune facture enregistrée.</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {eleveFactures.slice(0, 3).map((f) => (
                    <div key={f.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-sm font-semibold">{f.numero}</p>
                      <p className="text-xs text-muted-foreground">{formatXOF(f.montant)} • {getStatutFacture(f.id)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paiements</p>
              {elevePaiements.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Aucun paiement enregistré.</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {elevePaiements.slice(0, 3).map((p) => (
                    <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-sm font-semibold">{formatXOF(p.montant)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date_paiement || p.created_at || "").toLocaleDateString("fr-FR")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Examens</p>
              {eleveExamens.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Aucun examen programmé.</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {eleveExamens.slice(0, 3).map((x) => (
                    <div key={x.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-sm font-semibold">{x.type_examen}</p>
                      <p className="text-xs text-muted-foreground">{new Date(x.date_examen || "").toLocaleDateString("fr-FR")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
