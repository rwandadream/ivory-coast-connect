import { createFileRoute, Link } from "@tanstack/react-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { compressImage } from "@/lib/utils";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Phone,
  Mail,
  Eye,
  Sparkles,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useStore, formatXOF, formatTel, type Eleve } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TelInput } from "@/components/TelInput";
import { DatePicker } from "@/components/ui/date-picker";

const CniScanner = React.lazy(() =>
  import("@/components/CniScanner").then((m) => ({ default: m.CniScanner })),
);

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
  lieu_naissance: string;
  sexe: string;
  type_permis: string;
  telephone: string;
  code: string;
  nationalite: string;
  type_piece: string;
  num_piece: string;
  date_naissance: string;
  email: string;
  adresse: string;
  date_inscription: string;
  photo_cni?: string | null;
  photo_profil?: string | null;
  inspecteur?: string;
  est_parraine?: boolean;
  parrain_nom?: string;
};

const EleveCard = memo(
  ({
    eleve,
    onEdit,
    onDelete,
    onView,
  }: {
    eleve: Eleve;
    onEdit: (e: Eleve) => void;
    onDelete: (id: string) => Promise<void>;
    onView: (id: string) => void;
  }) => {
    return (
      <Card className="group p-3 sm:p-4 transition-all hover:shadow-elegant">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-xs sm:text-sm font-semibold text-primary-foreground uppercase">
            {(eleve.prenom?.[0] || "") + (eleve.nom?.[0] || "")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1 sm:gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm sm:text-base font-semibold text-foreground">
                  {eleve.prenom} {eleve.nom}
                </p>
                <Badge variant="secondary" className="mt-0.5 text-[9px] sm:text-[10px]">
                  {eleve.type_permis}
                </Badge>
              </div>
              <div className="flex gap-0.5 sm:gap-1 lg:opacity-0 transition-opacity lg:group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  onClick={() => onEdit(eleve)}
                >
                  <Pencil className="h-3.5 w-3.5 sm:h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-destructive"
                  onClick={() => {
                    if (
                      confirm(
                        `Supprimer ${eleve.prenom} ${eleve.nom} et toutes ses données associées ?`,
                      )
                    ) {
                      onDelete(eleve.id);
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
                <Phone className="h-3 w-3" /> {formatTel(eleve.telephone)}
              </p>
              {eleve.email && (
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3 w-3" /> {eleve.email}
                </p>
              )}
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Dossier {eleve.dossier_code}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(eleve.id)}>
            <Eye className="mr-1 h-3.5 w-3.5" /> Voir
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(eleve)}>
            <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive"
            onClick={() => {
              if (confirm(`Supprimer ${eleve.prenom} ${eleve.nom} ?`)) {
                onDelete(eleve.id);
                toast.success("Élève supprimé");
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    );
  },
);

function ElevesPage() {
  const { eleves, addEleve, updateEleve, deleteEleve } = useStore(
    useShallow((s) => ({
      eleves: s.eleves,
      addEleve: s.addEleve,
      updateEleve: s.updateEleve,
      deleteEleve: s.deleteEleve,
    })),
  );
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Eleve | null>(null);
  const [selectedEleveId, setSelectedEleveId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(24);

  // Derived state
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return eleves.filter(
      (e) =>
        e.nom.toLowerCase().includes(q) ||
        e.prenom.toLowerCase().includes(q) ||
        e.telephone.includes(search) ||
        (e.email && e.email.toLowerCase().includes(q)),
    );
  }, [eleves, search]);

  const displayedEleves = useMemo(() => {
    return filtered.slice(0, displayLimit);
  }, [filtered, displayLimit]);

  const hasMore = filtered.length > displayLimit;

  const selectedEleve = useMemo(
    () => eleves.find((e) => e.id === selectedEleveId) || null,
    [eleves, selectedEleveId],
  );

  const handleOpen = useCallback((e?: Eleve) => {
    setEditing(e ?? null);
    setOpen(true);
  }, []);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const stats = useMemo(() => {
    if (!isClient) return { topPermis: "-", monthlyCount: 0 };

    const permis = TYPES_PERMIS.map((type) => ({
      type,
      count: eleves.filter((e) => e.type_permis === type).length,
    }));
    const topPermis = [...permis].sort((a, b) => b.count - a.count)[0]?.type ?? "-";
    const now = new Date();
    const currentMonth = now.getMonth();
    const monthlyCount = eleves.filter(
      (e) => new Date(e.created_at || "").getMonth() === currentMonth,
    ).length;

    return { topPermis, monthlyCount };
  }, [eleves, isClient]);

  if (!isClient) {
    return (
      <div className="space-y-8">
        <PageHeader title="Chargement..." description="Accès aux dossiers élèves" />
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-slate-900/50 border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

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

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Total</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">Élèves enregistrés</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{eleves.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Nouveau ce mois</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">
              Inscrits ce mois-ci
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{stats.monthlyCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Permis le plus demandé</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">
              Préférence actuelle
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{stats.topPermis}</p>
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

      <div className="min-h-[200px]">
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
          <>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {displayedEleves.map((e) => (
                <EleveCard
                  key={e.id}
                  eleve={e}
                  onEdit={handleOpen}
                  onDelete={deleteEleve}
                  onView={setSelectedEleveId}
                />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => setDisplayLimit((l) => l + 24)}>
                  Charger plus d'élèves ({filtered.length - displayLimit} restants)
                </Button>
              </div>
            )}
          </>
        )}
      </div>

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

      <EleveDetailsDialog eleve={selectedEleve} onClose={() => setSelectedEleveId(null)} />
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
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState<EleveForm>({
    nom: "",
    prenom: "",
    lieu_naissance: "",
    sexe: "M",
    type_permis: "B",
    telephone: "",
    code: "",
    nationalite: "Ivoirienne",
    type_piece: "CNI",
    num_piece: "",
    date_naissance: "",
    email: "",
    adresse: "",
    date_inscription: "",
    photo_cni: null,
    photo_profil: null,
    inspecteur: "",
    est_parraine: false,
    parrain_nom: "",
  });

  useEffect(() => {
    if (open) {
      setShowScanner(false);
      setForm(
        editing
          ? {
              nom: editing.nom,
              prenom: editing.prenom,
              lieu_naissance: editing.lieu_naissance ?? "",
              sexe: editing.sexe ?? "M",
              type_permis: editing.type_permis,
              telephone: editing.telephone,
              code: editing.code ?? "",
              nationalite: editing.nationalite ?? "Ivoirienne",
              type_piece: editing.type_piece ?? "CNI",
              num_piece: editing.num_piece ?? "",
              date_naissance: editing.date_naissance ?? "",
              email: editing.email ?? "",
              adresse: editing.adresse ?? "",
              date_inscription: editing.date_inscription ?? "",
              photo_cni: editing.photo_cni ?? null,
              photo_profil: editing.photo_profil ?? null,
              inspecteur: editing.inspecteur ?? "",
              est_parraine: editing.est_parraine ?? false,
              parrain_nom: editing.parrain_nom ?? "",
            }
          : {
              nom: "",
              prenom: "",
              lieu_naissance: "",
              sexe: "M",
              type_permis: "B",
              telephone: "",
              code: "",
              nationalite: "Ivoirienne",
              type_piece: "CNI",
              num_piece: "",
              date_naissance: "",
              email: "",
              adresse: "",
              date_inscription: new Date().toISOString().slice(0, 10),
              photo_cni: null,
              photo_profil: null,
              inspecteur: "",
              est_parraine: false,
              parrain_nom: "",
            },
      );
    }
  }, [open, editing]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photo_cni" | "photo_profil",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setForm((prev) => ({ ...prev, [field]: compressed }));
        toast.success("Image optimisée et chargée");
      } catch (err) {
        toast.error("Erreur lors du traitement de l'image");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{editing ? "Modifier l'élève" : "Nouvel élève"}</DialogTitle>
              <DialogDescription>Renseignez les informations de l'élève.</DialogDescription>
            </div>
            {!editing && !showScanner && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => setShowScanner(true)}
              >
                <Sparkles className="h-4 w-4" /> Scanner CNI
              </Button>
            )}
          </div>
        </DialogHeader>

        {showScanner ? (
          <React.Suspense
            fallback={<div className="p-12 text-center text-slate-500">Chargement...</div>}
          >
            <CniScanner
              onClose={() => setShowScanner(false)}
              onScanComplete={(data) => {
                setForm((prev) => ({
                  ...prev,
                  nom: data.nom || prev.nom,
                  prenom: data.prenom || prev.prenom,
                  date_naissance: data.date_naissance || prev.date_naissance,
                }));
                setShowScanner(false);
              }}
            />
          </React.Suspense>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto px-1">
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
                } catch (err) {
                  console.error("Submit error:", err);
                  toast.error("Une erreur est survenue lors de l'enregistrement.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="grid gap-6 py-4"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">
                  Informations Générales
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénoms *</Label>
                    <Input
                      id="prenom"
                      value={form.prenom}
                      onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ln">Lieu de naissance (A)</Label>
                    <Input
                      id="ln"
                      value={form.lieu_naissance}
                      onChange={(e) => setForm({ ...form, lieu_naissance: e.target.value })}
                      placeholder="Ex: Abidjan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sexe *</Label>
                    <Select value={form.sexe} onValueChange={(v) => setForm({ ...form, sexe: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Catégorie (Permis) *</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="tel">Contact (Téléphone) *</Label>
                    <TelInput
                      id="tel"
                      value={form.telephone}
                      onChange={(v) => setForm({ ...form, telephone: v })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">
                  Identification
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="Code interne"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dn">Né(e) le *</Label>
                    <DatePicker
                      value={form.date_naissance}
                      onChange={(v) => setForm({ ...form, date_naissance: v })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nat">Nationalité</Label>
                    <Input
                      id="nat"
                      value={form.nationalite}
                      onChange={(e) => setForm({ ...form, nationalite: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type de pièce</Label>
                    <Select
                      value={form.type_piece}
                      onValueChange={(v) => setForm({ ...form, type_piece: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNI">CNI</SelectItem>
                        <SelectItem value="Attestation">Attestation</SelectItem>
                        <SelectItem value="Passeport">Passeport</SelectItem>
                        <SelectItem value="Carte Consulaire">Carte Consulaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="np">N° pièce</Label>
                    <Input
                      id="np"
                      value={form.num_piece}
                      onChange={(e) => setForm({ ...form, num_piece: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="di">Date d'inscription *</Label>
                    <DatePicker
                      value={form.date_inscription}
                      onChange={(v) => setForm({ ...form, date_inscription: v })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">
                  Suivi & Parrainage
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="inspecteur">Inspecteur</Label>
                    <Input
                      id="inspecteur"
                      value={form.inspecteur}
                      onChange={(e) => setForm({ ...form, inspecteur: e.target.value })}
                      placeholder="Nom de l'inspecteur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Élève parrainé ?</Label>
                    <Select
                      value={form.est_parraine ? "OUI" : "NON"}
                      onValueChange={(v) => setForm({ ...form, est_parraine: v === "OUI" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NON">Non</SelectItem>
                        <SelectItem value="OUI">Oui</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {form.est_parraine && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="parrain">Parrainé par</Label>
                    <Input
                      id="parrain"
                      value={form.parrain_nom}
                      onChange={(e) => setForm({ ...form, parrain_nom: e.target.value })}
                      placeholder="Nom du parrain"
                      required={form.est_parraine}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">
                  Photos & Documents
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label>Carte d'identité (CNI)</Label>
                    {form.photo_cni ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
                        <img
                          src={form.photo_cni}
                          alt="CNI"
                          className="h-full w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, photo_cni: null }))}
                          className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1 text-white hover:bg-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 transition-all hover:bg-slate-900 hover:border-primary/50">
                        <Upload className="h-6 w-6 text-slate-500" />
                        <span className="text-xs text-slate-400">Cliquez pour charger la CNI</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "photo_cni")}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-6">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EleveDetailsDialog({ eleve, onClose }: { eleve: Eleve | null; onClose: () => void }) {
  const { factures, paiements, examens, inscriptions, formations, getStatutFacture } = useStore(
    useShallow((s) => ({
      factures: s.factures,
      paiements: s.paiements,
      examens: s.examens,
      inscriptions: s.inscriptions,
      formations: s.formations,
      getStatutFacture: s.getStatutFacture,
    })),
  );

  const eleveFactures = useMemo(
    () => (eleve ? factures.filter((f) => f.eleve_id === eleve.id) : []),
    [eleve, factures],
  );
  const elevePaiements = useMemo(
    () => (eleve ? paiements.filter((p) => p.eleve_id === eleve.id) : []),
    [eleve, paiements],
  );
  const eleveExamens = useMemo(
    () => (eleve ? examens.filter((x) => x.eleve_id === eleve.id) : []),
    [eleve, examens],
  );
  const eleveInscription = useMemo(
    () => (eleve ? inscriptions.find((i) => i.eleve_id === eleve.id) : null),
    [eleve, inscriptions],
  );
  const formation = useMemo(
    () =>
      eleveInscription ? formations.find((f) => f.id === eleveInscription.formation_id) : null,
    [eleveInscription, formations],
  );

  return (
    <Dialog open={!!eleve} onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Fiche de l'élève</DialogTitle>
          <DialogDescription>Suivez les factures, paiements et examens associés.</DialogDescription>
        </DialogHeader>

        {eleve && (
          <div className="grid gap-6 mt-4">
            <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Élève</p>
                  <p className="text-2xl font-semibold">
                    {eleve.prenom} {eleve.nom}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={onClose}>
                    Fermer
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Contact (Téléphone)
                  </p>
                  <p className="mt-1 text-sm font-medium">{formatTel(eleve.telephone)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Lieu de naissance
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.lieu_naissance || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Catégorie (Permis)
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.type_permis}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Code
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.code || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Nationalité
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.nationalite || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Né(e) le
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {eleve.date_naissance
                      ? new Date(eleve.date_naissance).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Type de pièce
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.type_piece || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    N° pièce
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.num_piece || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Sexe
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {eleve.sexe === "M" ? "Masculin" : "Féminin"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Inspecteur
                  </p>
                  <p className="mt-1 text-sm font-medium">{eleve.inspecteur || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Parrainage
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {eleve.est_parraine ? `Parrainé par ${eleve.parrain_nom}` : "Non parrainé"}
                  </p>
                </div>
                <div />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Factures
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{eleveFactures.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Paiements
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{elevePaiements.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Examens
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{eleveExamens.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Formation
                  </p>
                  <p className="mt-2 text-sm font-semibold">{formation?.nom || "Aucune"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Dernières Factures
                </p>
                {eleveFactures.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">Aucune facture.</p>
                ) : (
                  <div className="space-y-2 mt-3">
                    {eleveFactures.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3"
                      >
                        <p className="text-sm font-semibold">{f.numero}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {getStatutFacture(f.id)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Derniers Paiements
                </p>
                {elevePaiements.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">Aucun paiement.</p>
                ) : (
                  <div className="space-y-2 mt-3">
                    {elevePaiements.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3"
                      >
                        <p className="text-sm font-semibold">{formatXOF(p.montant)}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(p.date_paiement || p.created_at || "").toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Examens</p>
                {eleveExamens.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">Aucun examen.</p>
                ) : (
                  <div className="space-y-2 mt-3">
                    {eleveExamens.slice(0, 3).map((x) => (
                      <div
                        key={x.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3"
                      >
                        <p className="text-sm font-semibold">{x.type_examen}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(x.date_examen || "").toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
