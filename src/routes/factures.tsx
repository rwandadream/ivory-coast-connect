import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileText, Printer, Trash2, Eye } from "lucide-react";
import { useStore, formatXOF, formatTel } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/factures")({
  head: () => ({ meta: [{ title: "Factures — SARRAH AUTO" }] }),
  component: FacturesPage,
});

function FacturesPage() {
  const { factures, eleves, formations, inscriptions, addInscription, deleteInscription, getMontantPaye, getStatutFacture } = useStore();
  const [openNew, setOpenNew] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);

  const formData = useState({ eleveId: "", formationId: "", tarif: 0, date: new Date().toISOString().slice(0, 10) });

  const statutLabel = { non_payee: "Non payée", partielle: "Partielle", payee: "Payée" };
  const statutColor = {
    non_payee: "bg-destructive/15 text-destructive border-destructive/30",
    partielle: "bg-warning/30 text-warning-foreground border-warning",
    payee: "bg-success/15 text-success border-success/30",
  };

  return (
    <div>
      <PageHeader
        title="Factures"
        description={`${factures.length} facture${factures.length > 1 ? "s" : ""} · format SAR-AAAA-NNNN`}
        actions={
          <Button onClick={() => setOpenNew(true)} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvelle inscription
          </Button>
        }
      />

      {factures.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune facture"
          description="Créez une inscription pour générer automatiquement une facture."
          action={<Button onClick={() => setOpenNew(true)}><Plus className="mr-1 h-4 w-4" /> Nouvelle inscription</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">N° Facture</th>
                <th className="px-4 py-3">Élève</th>
                <th className="px-4 py-3">Formation</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-right">Payé</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {factures.map((f) => {
                const eleve = eleves.find((e) => e.id === f.eleveId);
                const inscription = inscriptions.find((i) => i.id === f.inscriptionId);
                const formation = inscription ? formations.find((fr) => fr.id === inscription.formationId) : null;
                const paye = getMontantPaye(f.id);
                const statut = getStatutFacture(f.id);
                return (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{f.numero}</td>
                    <td className="px-4 py-3 font-medium">{eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formation?.nom ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatXOF(f.montant)}</td>
                    <td className="px-4 py-3 text-right text-success">{formatXOF(paye)}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={statutColor[statut]}>{statutLabel[statut]}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(f.dateEmission).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewing(f.id)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => {
                          if (confirm(`Supprimer la facture ${f.numero} et son inscription ?`)) {
                            if (inscription) deleteInscription(inscription.id);
                            toast.success("Facture supprimée");
                          }
                        }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NouvelleInscriptionDialog
        open={openNew}
        onOpenChange={setOpenNew}
        onSubmit={(data) => {
          addInscription(data);
          toast.success("Inscription créée et facture générée");
          setOpenNew(false);
        }}
      />

      <FactureView factureId={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

function NouvelleInscriptionDialog({
  open, onOpenChange, onSubmit,
}: {
  open: boolean; onOpenChange: (b: boolean) => void;
  onSubmit: (d: { eleveId: string; formationId: string; tarif: number; date: string }) => void;
}) {
  const { eleves, formations } = useStore();
  const [eleveId, setEleveId] = useState("");
  const [formationId, setFormationId] = useState("");
  const [tarif, setTarif] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const formationsActives = formations.filter((f) => f.actif);

  return (
    <Dialog open={open} onOpenChange={(b) => {
      onOpenChange(b);
      if (b) { setEleveId(""); setFormationId(""); setTarif(0); setDate(new Date().toISOString().slice(0, 10)); }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle inscription</DialogTitle>
          <DialogDescription>Une facture sera générée automatiquement.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!eleveId || !formationId || tarif <= 0) { toast.error("Tous les champs sont requis"); return; }
          onSubmit({ eleveId, formationId, tarif, date });
        }} className="grid gap-4">
          <div>
            <Label>Élève *</Label>
            <Select value={eleveId} onValueChange={setEleveId}>
              <SelectTrigger><SelectValue placeholder={eleves.length === 0 ? "Aucun élève — créez-en un d'abord" : "Choisir un élève"} /></SelectTrigger>
              <SelectContent>
                {eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.prenom} {e.nom} — {formatTel(e.telephone)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Formation *</Label>
            <Select value={formationId} onValueChange={(v) => {
              setFormationId(v);
              const f = formationsActives.find((x) => x.id === v);
              if (f) setTarif(f.prix);
            }}>
              <SelectTrigger><SelectValue placeholder="Choisir une formation" /></SelectTrigger>
              <SelectContent>
                {formationsActives.map((f) => <SelectItem key={f.id} value={f.id}>{f.nom} — {formatXOF(f.prix)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="tarif">Tarif appliqué (FCFA) *</Label>
              <Input id="tarif" type="number" min={0} value={tarif} onChange={(e) => setTarif(Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-gradient-primary">Créer et générer la facture</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FactureView({ factureId, onClose }: { factureId: string | null; onClose: () => void }) {
  const { factures, eleves, formations, inscriptions, paiements, getMontantPaye, getStatutFacture } = useStore();
  if (!factureId) return null;
  const f = factures.find((x) => x.id === factureId);
  if (!f) return null;
  const eleve = eleves.find((e) => e.id === f.eleveId);
  const inscription = inscriptions.find((i) => i.id === f.inscriptionId);
  const formation = inscription ? formations.find((fr) => fr.id === inscription.formationId) : null;
  const paye = getMontantPaye(f.id);
  const reste = f.montant - paye;
  const statut = getStatutFacture(f.id);
  const factPaiements = paiements.filter((p) => p.factureId === f.id);

  return (
    <Dialog open={!!factureId} onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="max-w-2xl">
        <div id="facture-print" className="space-y-6 p-2">
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">SARRAH AUTO</h2>
              <p className="text-xs text-muted-foreground">Auto-école · Côte d'Ivoire</p>
              <p className="text-xs text-muted-foreground">Tél : +225 XX XX XX XX XX</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-muted-foreground">Facture</p>
              <p className="font-mono text-lg font-bold">{f.numero}</p>
              <p className="text-xs text-muted-foreground">{new Date(f.dateEmission).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Facturé à</p>
            {eleve && (
              <div className="mt-1">
                <p className="font-semibold">{eleve.prenom} {eleve.nom}</p>
                <p className="text-sm text-muted-foreground">{formatTel(eleve.telephone)}</p>
                {eleve.email && <p className="text-sm text-muted-foreground">{eleve.email}</p>}
                {eleve.adresse && <p className="text-sm text-muted-foreground">{eleve.adresse}</p>}
              </div>
            )}
          </div>

          <table className="w-full text-sm">
            <thead className="border-b text-xs uppercase text-muted-foreground">
              <tr><th className="py-2 text-left">Désignation</th><th className="py-2 text-right">Montant</th></tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">
                  <p className="font-medium">{formation?.nom ?? "Formation"}</p>
                  {formation?.description && <p className="text-xs text-muted-foreground">{formation.description}</p>}
                </td>
                <td className="py-3 text-right font-semibold">{formatXOF(f.montant)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr><td className="pt-3 text-right text-sm">Total</td><td className="pt-3 text-right font-bold">{formatXOF(f.montant)}</td></tr>
              <tr><td className="text-right text-sm text-success">Payé</td><td className="text-right text-success">{formatXOF(paye)}</td></tr>
              <tr><td className="text-right text-sm font-bold">Reste à payer</td><td className="text-right text-lg font-bold text-primary">{formatXOF(reste)}</td></tr>
            </tfoot>
          </table>

          {factPaiements.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Historique des paiements</p>
              <div className="space-y-1.5">
                {factPaiements.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded border bg-muted/30 px-3 py-1.5 text-xs">
                    <span>{new Date(p.date).toLocaleDateString("fr-FR")} · {p.mode}</span>
                    <span className="font-semibold">{formatXOF(p.montant)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-3 text-center text-xs text-muted-foreground">
            Statut : <Badge variant="outline" className="ml-1">{statut === "payee" ? "Payée" : statut === "partielle" ? "Partiellement payée" : "Non payée"}</Badge>
          </div>
        </div>

        <DialogFooter className="no-print">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button onClick={() => window.print()} className="bg-gradient-primary">
            <Printer className="mr-1 h-4 w-4" /> Imprimer / PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
