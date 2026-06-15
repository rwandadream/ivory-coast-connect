import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Plus, FileText, Printer, Trash2, Eye, Download, MessageCircle } from "lucide-react";
import { useStore, formatXOF, formatTel, type Facture, type Eleve } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/factures")({
  head: () => ({ meta: [{ title: "Factures — SARAH AUTO" }] }),
  component: FacturesPage,
});

function FacturesPage() {
  const {
    factures,
    eleves,
    formations,
    inscriptions,
    addInscription,
    deleteInscription,
    getMontantPaye,
    getStatutFacture,
  } = useStore(
    useShallow((s) => ({
      factures: s.factures,
      eleves: s.eleves,
      formations: s.formations,
      inscriptions: s.inscriptions,
      addInscription: s.addInscription,
      deleteInscription: s.deleteInscription,
      getMontantPaye: s.getMontantPaye,
      getStatutFacture: s.getStatutFacture,
    })),
  );
  const [openNew, setOpenNew] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);

  const statutLabel = { non_payee: "Non payée", partielle: "Partielle", payee: "Payée" };
  const statutColor = {
    non_payee: "bg-destructive/15 text-destructive border-destructive/30",
    partielle: "bg-warning/30 text-warning-foreground border-warning",
    payee: "bg-success/15 text-success border-success/30",
  };

  const facturesWithDetails = useMemo(
    () =>
      factures.map((f) => {
        const inscription = inscriptions.find((i) => i.id === f.inscription_id) ?? null;
        const eleve = eleves.find((e) => e.id === f.eleve_id) ?? null;
        const formation = inscription
          ? (formations.find((fr) => fr.id === inscription.formation_id) ?? null)
          : null;
        return {
          facture: f,
          inscription,
          eleve,
          formation,
          paye: getMontantPaye(f.id),
          statut: getStatutFacture(f.id),
        };
      }),
    [factures, eleves, formations, inscriptions, getMontantPaye, getStatutFacture],
  );

  const handleWhatsAppReminder = (item: {
    eleve: Eleve | null;
    facture: Facture;
    paye: number;
    statut: string;
  }) => {
    const { eleve, facture, paye, statut } = item;
    if (!eleve) return;
    const cleanTel = eleve.telephone.replace(/\D/g, "");
    const reste = facture.montant - paye;
    const message = `Bonjour ${eleve.prenom} ${eleve.nom}, c'est l'auto-école SARAH AUTO. Un petit rappel concernant votre facture ${facture.numero}. Montant total: ${formatXOF(facture.montant)}. Reste à payer: ${formatXOF(reste)}. Merci de régulariser dès que possible.`;
    window.open(`https://wa.me/225${cleanTel}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const { facturesPayees, facturesPartielles, facturesNonPayees } = useMemo(
    () =>
      facturesWithDetails.reduce(
        (acc, item) => {
          acc.facturesPayees += item.statut === "payee" ? 1 : 0;
          acc.facturesPartielles += item.statut === "partielle" ? 1 : 0;
          acc.facturesNonPayees += item.statut === "non_payee" ? 1 : 0;
          return acc;
        },
        { facturesPayees: 0, facturesPartielles: 0, facturesNonPayees: 0 },
      ),
    [facturesWithDetails],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Factures"
        description={`${factures.length} facture${factures.length > 1 ? "s" : ""} · format SAR-AAAA-NNNN`}
        actions={
          <Button onClick={() => setOpenNew(true)} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvelle inscription
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Total</CardTitle>
            <CardDescription>Factures créées</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{factures.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Payées</CardTitle>
            <CardDescription>Factures réglées</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{facturesPayees}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>En retard</CardTitle>
            <CardDescription>Factures non payées</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{facturesNonPayees}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Partielles</CardTitle>
            <CardDescription>Paiements partiels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{facturesPartielles}</p>
          </CardContent>
        </Card>
      </div>

      {factures.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune facture"
          description="Créez une inscription pour générer automatiquement une facture."
          action={
            <Button onClick={() => setOpenNew(true)}>
              <Plus className="mr-1 h-4 w-4" /> Nouvelle inscription
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
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
                {facturesWithDetails.map((item) => {
                  const { facture: f, eleve, formation, paye, statut, inscription } = item;
                  return (
                    <tr key={f.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs font-semibold">{f.numero}</td>
                      <td className="px-4 py-3 font-medium">
                        {eleve ? `${eleve.prenom} ${eleve.nom}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formation?.nom ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatXOF(f.montant)}</td>
                      <td className="px-4 py-3 text-right text-success font-medium">
                        {formatXOF(paye)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={statutColor[statut]}>
                          {statutLabel[statut]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(f.date_emission || "").toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {statut !== "payee" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-green-500 hover:bg-green-500/10"
                              onClick={() => handleWhatsAppReminder(item)}
                              title="Relancer sur WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setViewing(f.id)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => {
                              if (
                                confirm(`Supprimer la facture ${f.numero} et son inscription ?`)
                              ) {
                                if (inscription) deleteInscription(inscription.id);
                                toast.success("Facture supprimée");
                              }
                            }}
                          >
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
        </div>
      )}

      <NouvelleInscriptionDialog
        open={openNew}
        onOpenChange={setOpenNew}
        onSubmit={async (data) => {
          await addInscription(data);
          toast.success("Inscription créée et facture générée");
          setOpenNew(false);
        }}
      />

      <FactureView factureId={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

function NouvelleInscriptionDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onSubmit: (d: {
    eleve_id: string;
    formation_id: string;
    tarif: number;
    date_inscription: string;
  }) => Promise<void>;
}) {
  const { eleves, formations } = useStore(
    useShallow((s) => ({
      eleves: s.eleves,
      formations: s.formations,
    })),
  );
  const [eleveId, setEleveId] = useState("");
  const [formationId, setFormationId] = useState("");
  const [tarif, setTarif] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formationsActives = formations.filter((f) => f.actif);

  return (
    <Dialog
      open={open}
      onOpenChange={(b) => {
        onOpenChange(b);
        if (b) {
          setEleveId("");
          setFormationId("");
          setTarif(0);
          setDate(new Date().toISOString().slice(0, 10));
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle inscription</DialogTitle>
          <DialogDescription>Une facture sera générée automatiquement.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!eleveId || !formationId || tarif <= 0) {
              toast.error("Tous les champs sont requis");
              return;
            }
            setIsSubmitting(true);
            try {
              await onSubmit({
                eleve_id: eleveId,
                formation_id: formationId,
                tarif,
                date_inscription: date,
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="grid gap-4"
        >
          <div>
            <Label>Élève *</Label>
            <Select value={eleveId} onValueChange={setEleveId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    eleves.length === 0 ? "Aucun élève — créez-en un d'abord" : "Choisir un élève"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {eleves.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.prenom} {e.nom} — {formatTel(e.telephone)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Formation *</Label>
            <Select
              value={formationId}
              onValueChange={(v) => {
                setFormationId(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une formation" />
              </SelectTrigger>
              <SelectContent>
                {formationsActives.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.nom} — {formatXOF(f.prix ?? 0)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="tarif">Tarif appliqué (FCFA) *</Label>
              <MoneyInput
                id="tarif"
                value={tarif}
                onValueChange={(value: number) => setTarif(value)}
                placeholder="0"
                min={0}
                max={999999999999}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              {isSubmitting ? "Création..." : "Créer et générer la facture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FactureView({ factureId, onClose }: { factureId: string | null; onClose: () => void }) {
  const {
    factures,
    eleves,
    formations,
    inscriptions,
    paiements,
    getMontantPaye,
    getStatutFacture,
  } = useStore(
    useShallow((s) => ({
      factures: s.factures,
      eleves: s.eleves,
      formations: s.formations,
      inscriptions: s.inscriptions,
      paiements: s.paiements,
      getMontantPaye: s.getMontantPaye,
      getStatutFacture: s.getStatutFacture,
    })),
  );
  const f = factureId ? factures.find((x) => x.id === factureId) : null;
  const eleve = f ? eleves.find((e) => e.id === f.eleve_id) : null;
  const inscription = f ? inscriptions.find((i) => i.id === f.inscription_id) : null;
  const formation = inscription
    ? formations.find((fr) => fr.id === inscription.formation_id)
    : null;
  const paye = f ? getMontantPaye(f.id) : 0;
  const reste = f ? f.montant - paye : 0;
  const statut = f ? getStatutFacture(f.id) : "non_payee";
  const factPaiements = f ? paiements.filter((p) => p.facture_id === f.id) : [];

  const handleDownloadPDF = async () => {
    if (!f || !eleve || !formation) return;
    const toastId = toast.loading("Génération du PDF en cours...");
    try {
      const { generateInvoicePDF } = await import("@/lib/pdf-generator");
      await generateInvoicePDF({
        numero: f.numero,
        date: f.date_emission || "",
        eleve: {
          nom: eleve.nom,
          prenom: eleve.prenom,
          telephone: formatTel(eleve.telephone),
          adresse: eleve.adresse || undefined,
        },
        formation: formation.nom,
        montant: f.montant,
        paiements: factPaiements.map((p) => ({
          date: p.date_paiement || p.created_at || "",
          montant: p.montant,
          mode: p.mode_paiement || "especes",
        })),
      });
      toast.success("PDF téléchargé avec succès", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la génération du PDF", { id: toastId });
    }
  };

  return (
    <Dialog open={!!factureId} onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        {f ? (
          <div className="space-y-6 p-2">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">SARAH AUTO</h2>
                <p className="text-xs text-muted-foreground">Auto-école · Centre de Formation</p>
                <p className="text-xs text-muted-foreground">Abidjan, Côte d'Ivoire</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-bold text-muted-foreground">Facture</p>
                <p className="font-mono text-lg font-bold">{f.numero}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(f.date_emission || "").toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Destinataire
                </p>
                {eleve && (
                  <div className="mt-2">
                    <p className="font-bold text-base">
                      {eleve.prenom} {eleve.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatTel(eleve.telephone)}</p>
                    {eleve.email && <p className="text-sm text-muted-foreground">{eleve.email}</p>}
                    {eleve.adresse && (
                      <p className="text-sm text-muted-foreground">{eleve.adresse}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold">
                  <tr>
                    <th className="px-4 py-3 text-left">Désignation</th>
                    <th className="px-4 py-3 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-4">
                      <p className="font-bold">{formation?.nom ?? "Formation"}</p>
                      {formation?.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formation.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-bold">{formatXOF(f.montant)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-[250px] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{formatXOF(f.montant)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Déjà payé</span>
                  <span className="font-bold">{formatXOF(paye)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg">
                  <span className="font-bold text-primary">Reste à payer</span>
                  <span className="font-extrabold text-primary">{formatXOF(reste)}</span>
                </div>
              </div>
            </div>

            {factPaiements.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Historique des paiements
                </p>
                <div className="space-y-2">
                  {factPaiements.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-2 text-xs transition-hover hover:bg-muted/30"
                    >
                      <span className="font-medium">
                        {new Date(p.date_paiement || "").toLocaleDateString("fr-FR")} ·{" "}
                        {p.mode_paiement}
                      </span>
                      <span className="font-bold text-success">{formatXOF(p.montant)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 mt-6">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => window.print()} variant="secondary">
                  <Printer className="mr-2 h-4 w-4" /> Imprimer
                </Button>
                <Button onClick={handleDownloadPDF} className="bg-gradient-primary">
                  <Download className="mr-2 h-4 w-4" /> Télécharger PDF
                </Button>
              </div>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 p-6 text-center">
            <p className="text-lg font-semibold">Facture introuvable</p>
            <p className="text-sm text-muted-foreground">
              Cette facture n’est plus disponible. Fermez la fenêtre et réessayez.
            </p>
            <DialogFooter className="justify-center">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
