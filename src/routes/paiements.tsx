import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { Plus, Wallet, Trash2, Banknote, Smartphone, Building } from "lucide-react";
import { useStore, formatXOF, labelModePaiement, type ModePaiement } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
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

export const Route = createFileRoute("/paiements")({
  head: () => ({ meta: [{ title: "Paiements — SARAH AUTO" }] }),
  component: PaiementsPage,
});

const MODE_ICONS: Record<ModePaiement, typeof Banknote> = {
  especes: Banknote,
  orange_money: Smartphone,
  wave: Smartphone,
  virement: Building,
};

function PaiementsPage() {
  const { paiements, factures, eleves, addPaiement, deletePaiement, getMontantPaye } = useStore(
    useShallow((s) => ({
      paiements: s.paiements,
      factures: s.factures,
      eleves: s.eleves,
      addPaiement: s.addPaiement,
      deletePaiement: s.deletePaiement,
      getMontantPaye: s.getMontantPaye,
    })),
  );

  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const total = useMemo(() => paiements.reduce((s, p) => s + p.montant, 0), [paiements]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-8">
        <PageHeader title="Chargement..." description="Accès aux règlements" />
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Paiements"
        description={`${paiements.length} paiement${paiements.length > 1 ? "s" : ""} · Total : ${formatXOF(total)}`}
        actions={
          <Button
            onClick={handleOpen}
            className="bg-gradient-primary shadow-glow transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            disabled={factures.length === 0}
          >
            <Plus className="mr-1 h-4 w-4" /> Nouveau paiement
          </Button>
        }
      />

      <div className="min-h-[300px]">
        {paiements.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Aucun paiement"
            description={
              factures.length === 0 ? "Créez une facture d'abord." : "Enregistrez un règlement."
            }
          />
        ) : (
          <div className="space-y-3">
            {paiements.map((p) => {
              const facture = factures.find((f) => f.id === p.facture_id);
              const eleve = eleves.find((e) => e.id === p.eleve_id);
              const Icon = MODE_ICONS[p.mode_paiement as ModePaiement] || Banknote;
              return (
                <Card
                  key={p.id}
                  className="flex items-center gap-4 p-4 transition-all hover:shadow-elegant"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-success/15 text-success">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}
                      </p>
                      {facture && (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {facture.numero}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {labelModePaiement(p.mode_paiement || "especes")} ·{" "}
                      {isClient
                        ? new Date(p.date_paiement || "").toLocaleDateString("fr-FR")
                        : "..."}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success">{formatXOF(p.montant)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Supprimer ?")) {
                        deletePaiement(p.id);
                        toast.success("Supprimé");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <PaiementDialog
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => {
          await addPaiement(data);
          toast.success("Paiement enregistré");
          setOpen(false);
        }}
      />
    </div>
  );
}

function PaiementDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onSubmit: (d: {
    facture_id: string;
    eleve_id: string;
    montant: number;
    mode_paiement: string;
    date_paiement: string;
    reference?: string;
    notes?: string;
  }) => Promise<void>;
}) {
  const { factures, eleves, getMontantPaye, getStatutFacture } = useStore(
    useShallow((s) => ({
      factures: s.factures,
      eleves: s.eleves,
      getMontantPaye: s.getMontantPaye,
      getStatutFacture: s.getStatutFacture,
    })),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facture_id, setFactureId] = useState("");
  const [montant, setMontant] = useState(0);
  const [mode_paiement, setMode] = useState<ModePaiement>("especes");
  const [date_paiement, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setFactureId("");
      setMontant(0);
      setMode("especes");
      setDate(new Date().toISOString().slice(0, 10));
      setReference("");
      setNotes("");
    }
  }, [open]);

  const facturesOuvertes = factures.filter((f) => getStatutFacture(f.id) !== "payee");
  const facture = factures.find((f) => f.id === facture_id);
  const reste = facture ? facture.montant - getMontantPaye(facture.id) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouveau paiement</DialogTitle>
          <DialogDescription>Enregistrer un règlement sur une facture.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!facture_id || montant <= 0 || !facture) {
              toast.error("Facture et montant requis");
              return;
            }
            setIsSubmitting(true);
            try {
              await onSubmit({
                facture_id,
                eleve_id: facture.eleve_id || "",
                montant,
                mode_paiement,
                date_paiement,
                reference: reference || undefined,
                notes: notes || undefined,
              });
            } catch (err) {
              toast.error("Erreur technique");
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="grid gap-4 py-4"
        >
          <div>
            <Label>Facture *</Label>
            <Select value={facture_id} onValueChange={setFactureId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={facturesOuvertes.length === 0 ? "Aucune facture" : "Choisir"}
                />
              </SelectTrigger>
              <SelectContent>
                {facturesOuvertes.map((f) => {
                  const e = eleves.find((el) => el.id === f.eleve_id);
                  const r = f.montant - getMontantPaye(f.id);
                  return (
                    <SelectItem key={f.id} value={f.id}>
                      {f.numero} — {e ? `${e.prenom} ${e.nom}` : "—"} ({formatXOF(r)})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="m">Montant (FCFA) *</Label>
              <MoneyInput
                id="m"
                value={montant}
                onValueChange={setMontant}
                min={0}
                max={facture ? reste : 99999999}
                required
              />
            </div>
            <div>
              <Label>Mode *</Label>
              <Select value={mode_paiement} onValueChange={(v) => setMode(v as ModePaiement)}>
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
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="d">Date *</Label>
              <Input
                id="d"
                type="date"
                value={date_paiement}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ref">Référence</Label>
              <Input
                id="ref"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="N° transaction"
              />
            </div>
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
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
