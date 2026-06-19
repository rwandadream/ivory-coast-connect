import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo, useState, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import {
  Plus,
  FileText,
  Printer,
  Trash2,
  Eye,
  Download,
  MessageCircle,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStore, formatXOF, formatTel, type Facture, type Eleve } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { MoneyInput } from "@/components/ui/money-input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/factures")({
  head: () => ({ meta: [{ title: "Factures — SARAH AUTO" }] }),
  component: FacturesPage,
});

type StatutFilter = "tous" | "non_payee" | "partielle" | "payee";
type SortKey = "numero" | "eleve" | "formation" | "montant" | "paye" | "statut" | "date";
type SortDir = "asc" | "desc";

const STATUT_LABEL: Record<string, string> = {
  non_payee: "Non payée",
  partielle: "Partielle",
  payee: "Payée",
};

const STATUT_STYLE: Record<string, string> = {
  non_payee: "bg-destructive/10 text-destructive border-destructive/25 hover:bg-destructive/15",
  partielle: "bg-amber-500/10 text-amber-700 border-amber-400/30 hover:bg-amber-500/15 dark:text-amber-400",
  payee: "bg-emerald-500/10 text-emerald-700 border-emerald-400/30 hover:bg-emerald-500/15 dark:text-emerald-400",
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

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
  const [deleteTarget, setDeleteTarget] = useState<{ factureId: string; inscriptionId: string | null; numero: string } | null>(null);

  // Filtres & tri
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState<StatutFilter>("tous");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const facturesWithDetails = useMemo(
    () =>
      factures.map((f) => {
        const inscription = inscriptions.find((i) => i.id === f.inscription_id) ?? null;
        const eleve = eleves.find((e) => e.id === f.eleve_id) ?? null;
        const formation = inscription
          ? (formations.find((fr) => fr.id === inscription.formation_id) ?? null)
          : null;
        const paye = getMontantPaye(f.id);
        const statut = getStatutFacture(f.id);
        return { facture: f, inscription, eleve, formation, paye, statut };
      }),
    [factures, eleves, formations, inscriptions, getMontantPaye, getStatutFacture],
  );

  /* ── Stats ── */
  const stats = useMemo(() => {
    return facturesWithDetails.reduce(
      (acc, item) => {
        acc.total += item.facture.montant;
        acc.paye += item.paye;
        if (item.statut === "payee") acc.payees++;
        if (item.statut === "partielle") acc.partielles++;
        if (item.statut === "non_payee") acc.nonPayees++;
        return acc;
      },
      { total: 0, paye: 0, payees: 0, partielles: 0, nonPayees: 0 },
    );
  }, [facturesWithDetails]);

  /* ── Filtrage + tri ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let rows = facturesWithDetails;

    if (statutFilter !== "tous") rows = rows.filter((r) => r.statut === statutFilter);

    if (q) {
      rows = rows.filter(
        (r) =>
          r.facture.numero.toLowerCase().includes(q) ||
          (r.eleve && `${r.eleve.prenom} ${r.eleve.nom}`.toLowerCase().includes(q)) ||
          (r.formation && r.formation.nom.toLowerCase().includes(q)),
      );
    }

    rows = [...rows].sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      switch (sortKey) {
        case "numero": valA = a.facture.numero; valB = b.facture.numero; break;
        case "eleve": valA = a.eleve ? `${a.eleve.prenom} ${a.eleve.nom}` : ""; valB = b.eleve ? `${b.eleve.prenom} ${b.eleve.nom}` : ""; break;
        case "formation": valA = a.formation?.nom ?? ""; valB = b.formation?.nom ?? ""; break;
        case "montant": valA = a.facture.montant; valB = b.facture.montant; break;
        case "paye": valA = a.paye; valB = b.paye; break;
        case "statut": valA = a.statut; valB = b.statut; break;
        case "date": valA = a.facture.date_emission ?? ""; valB = b.facture.date_emission ?? ""; break;
      }
      const cmp = typeof valA === "number" && typeof valB === "number" ? valA - valB : String(valA).localeCompare(String(valB));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [facturesWithDetails, search, statutFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortKey],
  );

  const handleWhatsApp = useCallback(
    (item: { eleve: Eleve | null; facture: Facture; paye: number }) => {
      const { eleve, facture, paye } = item;
      if (!eleve) return;
      const cleanTel = eleve.telephone.replace(/\D/g, "");
      const reste = facture.montant - paye;
      const msg = `Bonjour ${eleve.prenom} ${eleve.nom}, c'est l'auto-école SARAH AUTO. Un petit rappel concernant votre facture ${facture.numero}. Montant total : ${formatXOF(facture.montant)}. Reste à payer : ${formatXOF(reste)}. Merci de régulariser dès que possible.`;
      window.open(`https://wa.me/225${cleanTel}?text=${encodeURIComponent(msg)}`, "_blank");
    },
    [],
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.inscriptionId) deleteInscription(deleteTarget.inscriptionId);
    toast.success("Facture supprimée");
    setDeleteTarget(null);
  }, [deleteTarget, deleteInscription]);

  /* ── SortIcon ── */
  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" />;
    return sortDir === "asc"
      ? <ArrowUp className="ml-1 h-3 w-3 text-primary" />
      : <ArrowDown className="ml-1 h-3 w-3 text-primary" />;
  };

  const SortableHead = ({ col, label, className }: { col: SortKey; label: string; className?: string }) => (
    <TableHead
      className={cn("cursor-pointer select-none whitespace-nowrap", className)}
      onClick={() => handleSort(col)}
    >
      <span className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors">
        {label}
        <SortIcon col={col} />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Factures"
        description={`${factures.length} facture${factures.length > 1 ? "s" : ""} · format SAR-AAAA-NNNN`}
        actions={
          <Button onClick={() => setOpenNew(true)} className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Nouvelle inscription
          </Button>
        }
      />

      {/* ── KPI Cards ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total factures" value={String(factures.length)} sub="Toutes périodes" />
        <StatCard label="Payées" value={String(stats.payees)} sub={formatXOF(stats.paye) + " encaissés"} accent="success" />
        <StatCard label="En retard" value={String(stats.nonPayees)} sub={formatXOF(stats.total - stats.paye) + " à recouvrer"} accent="danger" />
        <StatCard label="Partielles" value={String(stats.partielles)} sub="Paiements incomplets" accent="warning" />
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
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">

          {/* ── Barre de filtres ── */}
          <div className="flex flex-col gap-3 border-b bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Chercher n°, élève, formation…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-9 text-sm bg-background"
              />
            </div>

            {/* Filtre statut — pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["tous", "payee", "partielle", "non_payee"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setStatutFilter(s); setPage(1); }}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-all border",
                    s === statutFilter
                      ? s === "tous"
                        ? "bg-foreground text-background border-foreground"
                        : cn(STATUT_STYLE[s], "border-current")
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-transparent",
                  )}
                >
                  {s === "tous"
                    ? `Toutes (${factures.length})`
                    : s === "payee"
                    ? `Payées (${stats.payees})`
                    : s === "partielle"
                    ? `Partielles (${stats.partielles})`
                    : `Non payées (${stats.nonPayees})`}
                </button>
              ))}
            </div>
          </div>

          {/* ── Table ── */}
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <SortableHead col="numero" label="N° Facture" className="pl-4 w-36" />
                <SortableHead col="eleve" label="Élève" />
                <SortableHead col="formation" label="Formation" className="hidden md:table-cell" />
                <SortableHead col="montant" label="Montant" className="text-right" />
                <SortableHead col="paye" label="Payé" className="text-right hidden sm:table-cell" />
                <SortableHead col="statut" label="Statut" />
                <SortableHead col="date" label="Date" className="hidden lg:table-cell" />
                <TableHead className="w-12 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    Aucun résultat pour cette recherche.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map(({ facture: f, eleve, formation, paye, statut, inscription }) => {
                  const reste = f.montant - paye;
                  return (
                    <TableRow key={f.id} className="group">
                      <TableCell className="pl-4 font-mono text-xs font-semibold text-muted-foreground">
                        {f.numero}
                      </TableCell>
                      <TableCell>
                        {eleve ? (
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {eleve.prenom} {eleve.nom}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatTel(eleve.telephone)}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formation?.nom ?? "—"}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-sm">
                        {formatXOF(f.montant)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">
                        {formatXOF(paye)}
                        {reste > 0 && (
                          <p className="text-[10px] text-muted-foreground font-normal">
                            reste {formatXOF(reste)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-medium", STATUT_STYLE[statut])}
                        >
                          {STATUT_LABEL[statut]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground tabular-nums">
                        {f.date_emission
                          ? new Date(f.date_emission).toLocaleDateString("fr-FR")
                          : "—"}
                      </TableCell>
                      <TableCell className="pr-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => setViewing(f.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir la facture
                            </DropdownMenuItem>
                            {statut !== "payee" && (
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-600"
                                onClick={() => handleWhatsApp({ eleve, facture: f, paye })}
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Relancer WhatsApp
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setDeleteTarget({
                                  factureId: f.id,
                                  inscriptionId: inscription?.id ?? null,
                                  numero: f.numero,
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ── Pagination ── */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} sur {filtered.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <span>Lignes</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="rounded border border-border bg-background px-2 py-0.5 text-xs"
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const n = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3;
                  if (n < 1 || n > totalPages) return null;
                  return (
                    <Button
                      key={n}
                      variant={page === n ? "default" : "ghost"}
                      size="icon"
                      className={cn("h-7 w-7 text-xs", page === n && "bg-primary text-primary-foreground")}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  );
                })}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Dialogs ── */}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cette facture ?"
        description={
          deleteTarget
            ? `La facture ${deleteTarget.numero} et son inscription associée seront définitivement supprimées. Cette action est irréversible.`
            : undefined
        }
        confirmLabel="Supprimer définitivement"
        onConfirm={handleDelete}
      />
    </div>
  );
}

/* ── StatCard ── */
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "success" | "danger" | "warning";
}) {
  const accentMap: Record<string, string> = {
    success: "text-emerald-600 dark:text-emerald-400",
    danger: "text-destructive",
    warning: "text-amber-600 dark:text-amber-400",
  };
  const accentClass = accent ? (accentMap[accent] ?? "text-foreground") : "text-foreground";

  return (
    <Card className="border-border bg-card/70 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-medium">{label}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className={cn("text-2xl font-bold tabular-nums", accentClass)}>{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

/* ── NouvelleInscriptionDialog ── */
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
    useShallow((s) => ({ eleves: s.eleves, formations: s.formations })),
  );
  const [eleveId, setEleveId] = useState("");
  const [formationId, setFormationId] = useState("");
  const [tarif, setTarif] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formationsActives = formations.filter((f) => f.actif);

  const reset = () => {
    setEleveId("");
    setFormationId("");
    setTarif(0);
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <Dialog open={open} onOpenChange={(b) => { onOpenChange(b); if (b) reset(); }}>
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
              await onSubmit({ eleve_id: eleveId, formation_id: formationId, tarif, date_inscription: date });
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
                  placeholder={eleves.length === 0 ? "Aucun élève — créez-en un d'abord" : "Choisir un élève"}
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
            <Select value={formationId} onValueChange={setFormationId}>
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
                onValueChange={(v: number) => setTarif(v)}
                placeholder="0"
                min={0}
                max={999999999999}
                required
              />
            </div>
            <div>
              <Label htmlFor="df">Date d'émission *</Label>
              <DatePicker value={date} onChange={setDate} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? "Création…" : "Créer et générer la facture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── FactureView ── */
function FactureView({ factureId, onClose }: { factureId: string | null; onClose: () => void }) {
  const { factures, eleves, formations, inscriptions, paiements, getMontantPaye, getStatutFacture } =
    useStore(
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
  const formation = inscription ? formations.find((fr) => fr.id === inscription.formation_id) : null;
  const paye = f ? getMontantPaye(f.id) : 0;
  const reste = f ? f.montant - paye : 0;
  const factPaiements = f ? paiements.filter((p) => p.facture_id === f.id) : [];

  const handleDownloadPDF = async () => {
    if (!f || !eleve || !formation) return;
    const toastId = toast.loading("Génération du PDF en cours…");
    try {
      const { generateInvoicePDF } = await import("@/lib/pdf-generator");
      await generateInvoicePDF({
        numero: f.numero,
        date: f.date_emission || "",
        eleve: { nom: eleve.nom, prenom: eleve.prenom, telephone: formatTel(eleve.telephone), adresse: eleve.adresse || undefined },
        formation: formation.nom,
        montant: f.montant,
        paiements: factPaiements.map((p) => ({
          date: p.date_paiement || p.created_at || "",
          montant: p.montant,
          mode: p.mode_paiement || "especes",
        })),
      });
      toast.success("PDF téléchargé", { id: toastId });
    } catch {
      toast.error("Erreur lors de la génération du PDF", { id: toastId });
    }
  };

  return (
    <Dialog open={!!factureId} onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        {f ? (
          <div className="space-y-6 p-2">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <Logo size={60} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">SARAH AUTO</h2>
                  <p className="text-xs text-muted-foreground">Auto-école · Centre de Formation</p>
                  <p className="text-xs text-muted-foreground">Abidjan, Côte d'Ivoire</p>
                </div>
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
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Destinataire</p>
                {eleve && (
                  <div className="mt-2">
                    <p className="font-bold text-base">{eleve.prenom} {eleve.nom}</p>
                    <p className="text-sm text-muted-foreground">{formatTel(eleve.telephone)}</p>
                    {eleve.email && <p className="text-sm text-muted-foreground">{eleve.email}</p>}
                    {eleve.adresse && <p className="text-sm text-muted-foreground">{eleve.adresse}</p>}
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
                        <p className="text-xs text-muted-foreground mt-0.5">{formation.description}</p>
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
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
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
                      className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-2 text-xs hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-medium">
                        {new Date(p.date_paiement || "").toLocaleDateString("fr-FR")} · {p.mode_paiement}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatXOF(p.montant)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 mt-6">
              <Button variant="outline" onClick={onClose}>Fermer</Button>
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
            <p className="text-sm text-muted-foreground">Cette facture n'est plus disponible.</p>
            <DialogFooter className="justify-center">
              <Button variant="outline" onClick={onClose}>Fermer</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
