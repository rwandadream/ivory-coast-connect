import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Wallet,
  Fuel,
  Wrench,
  ShieldCheck,
  UserCheck,
  Package,
  MoreHorizontal,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { useStore, formatXOF, type Depense } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/comptabilite")({
  head: () => ({ meta: [{ title: "Comptabilité — SARAH AUTO" }] }),
  component: ComptabilitePage,
});

const CATEGORIES = [
  { id: "carburant", label: "Carburant", icon: Fuel },
  { id: "entretien", label: "Entretien véhicules", icon: Wrench },
  { id: "reparations", label: "Réparations", icon: Wrench },
  { id: "assurance", label: "Assurance", icon: ShieldCheck },
  { id: "salaires", label: "Salaires", icon: UserCheck },
  { id: "fournitures", label: "Fournitures", icon: Package },
  { id: "autres", label: "Autres dépenses", icon: MoreHorizontal },
];

type DepenseForm = {
  categorie: string;
  montant: string;
  date: string;
  description: string;
  mode_paiement: string;
  vehicule_id?: string;
};

function ComptabilitePage() {
  const { depenses, addDepense, updateDepense, deleteDepense } = useStore(
    useShallow((s) => ({
      depenses: s.depenses,
      addDepense: s.addDepense,
      updateDepense: s.updateDepense,
      deleteDepense: s.deleteDepense,
    })),
  );

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Depense | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return depenses.filter(
      (d) =>
        d.categorie.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)),
    );
  }, [depenses, search]);

  const stats = useMemo(() => {
    const total = depenses.reduce((sum, d) => sum + d.montant, 0);
    const thisMonth = depenses
      .filter((d) => new Date(d.date).getMonth() === new Date().getMonth())
      .reduce((sum, d) => sum + d.montant, 0);
    return { total, thisMonth };
  }, [depenses]);

  const handleOpen = (d?: Depense) => {
    setEditing(d ?? null);
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Comptabilité & Dépenses"
        description="Gérez les sorties d'argent et suivez vos coûts d'exploitation."
        actions={
          <Button onClick={() => handleOpen()} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvelle dépense
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Total des dépenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold">{formatXOF(stats.total)}</p>
            <p className="text-xs text-muted-foreground mt-1">Cumul historique</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Dépenses du mois
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold">{formatXOF(stats.thisMonth)}</p>
            <p className="text-xs text-muted-foreground mt-1">Mois en cours</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par catégorie ou description…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="min-h-[200px]">
        {filtered.length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title={depenses.length === 0 ? "Aucune dépense" : "Aucun résultat"}
            description={
              depenses.length === 0
                ? "Enregistrez votre première dépense pour commencer le suivi."
                : "Essayez une autre recherche."
            }
          />
        ) : (
          <div className="grid gap-4">
            {filtered.map((d) => (
              <Card
                key={d.id}
                className="group overflow-hidden transition-all hover:shadow-elegant"
              >
                <div className="flex items-center justify-between p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {(() => {
                        const Icon =
                          CATEGORIES.find((c) => c.id === d.categorie)?.icon || MoreHorizontal;
                        return <Icon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {CATEGORIES.find((c) => c.id === d.categorie)?.label || d.categorie}
                        </p>
                        <Badge variant="outline" className="text-[10px] uppercase">
                                                   {(d.mode_paiement || "especes").replace("_", " ")}
                                                 </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(d.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {d.description && (
                        <p className="text-xs text-muted-foreground mt-1 italic italic">
                          "{d.description}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-500">-{formatXOF(d.montant)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpen(d)}>
                          <Pencil className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            if (confirm("Supprimer cette dépense ?")) {
                              deleteDepense(d.id);
                              toast.success("Dépense supprimée");
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DepenseDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSubmit={async (data) => {
          const user = await getCurrentUser();
          const payload = {
            ...data,
            montant: parseFloat(data.montant),
            utilisateur_id: user?.id || "system",
          };

          if (editing) {
            await updateDepense(editing.id, payload);
            toast.success("Dépense mise à jour");
          } else {
            await addDepense(payload);
            toast.success("Dépense ajoutée");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function DepenseDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  editing: Depense | null;
  onSubmit: (data: DepenseForm) => Promise<void>;
}) {
  const [form, setForm] = useState<DepenseForm>({
    categorie: "autres",
    montant: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    mode_paiement: "especes",
    vehicule_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          categorie: editing.categorie,
          montant: editing.montant.toString(),
          date: editing.date,
          description: editing.description || "",
          mode_paiement: editing.mode_paiement || "especes",
          vehicule_id: editing.vehicule_id || "",
        });
      } else {
        setForm({
          categorie: "autres",
          montant: "",
          date: new Date().toISOString().slice(0, 10),
          description: "",
          mode_paiement: "especes",
          vehicule_id: "",
        });
      }
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la dépense" : "Nouvelle dépense"}</DialogTitle>
          <DialogDescription>Enregistrez les détails de la dépense effectuée.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.montant || parseFloat(form.montant) <= 0) {
              toast.error("Le montant doit être supérieur à 0");
              return;
            }
            setIsSubmitting(true);
            try {
              await onSubmit(form);
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="categorie">Catégorie</Label>
            <Select
              value={form.categorie}
              onValueChange={(v) => setForm({ ...form, categorie: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant</Label>
              <MoneyInput
                id="montant"
                value={parseFloat(form.montant) || 0}
                onValueChange={(v) => setForm({ ...form, montant: v.toString() })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Mode de paiement</Label>
            <Select
              value={form.mode_paiement}
              onValueChange={(v) => setForm({ ...form, mode_paiement: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="orange_money">Orange Money</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optionnel)</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Facture CIE, Réparation voiture #3..."
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
              {isSubmitting ? "Chargement..." : editing ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
