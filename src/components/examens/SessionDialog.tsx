import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type ExamenSession, type ExamenSessionStatus, type Tables } from "@/lib/store";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: ExamenSession | null;
  onSave: (
    data: Tables["examen_sessions"]["Insert"] | Tables["examen_sessions"]["Update"],
  ) => Promise<void>;
}

const EXAM_TYPES = ["Code", "Conduite"];
const CATEGORIES = ["A", "B", "AB", "BCDE", "ABCD"];
const STATUSES: ExamenSessionStatus[] = [
  "brouillon",
  "programmée",
  "en cours",
  "terminée",
  "annulée",
];

export function SessionDialog({ open, onOpenChange, session, onSave }: SessionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    type_examen: "Code",
    date_examen: new Date().toISOString().slice(0, 10),
    heure_examen: "08:00",
    centre: "",
    lieu: "",
    categorie: "B",
    statut: "brouillon",
    observations: "",
  });

  useEffect(() => {
    if (session) {
      setFormData({
        titre: session.titre,
        type_examen: session.type_examen,
        date_examen: session.date_examen,
        heure_examen: session.heure_examen.slice(0, 5),
        centre: session.centre,
        lieu: session.lieu,
        categorie: session.categorie,
        statut: session.statut as ExamenSessionStatus,
        observations: session.observations || "",
      });
    } else {
      setFormData({
        titre: "",
        type_examen: "Code",
        date_examen: new Date().toISOString().slice(0, 10),
        heure_examen: "08:00",
        centre: "",
        lieu: "",
        categorie: "B",
        statut: "brouillon",
        observations: "",
      });
    }
  }, [session, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Generate bordereau number if new session
      const payload = {
        ...formData,
        numero_bordereau:
          session?.numero_bordereau ||
          `SAE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
      };
      await onSave(payload);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{session ? "Modifier la session" : "Nouvelle session d'examen"}</DialogTitle>
          <DialogDescription>
            Configurez les détails de la session et le lieu de l'examen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="titre">Titre de la session *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Session Code Juin 2026"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type d'examen *</Label>
              <Select
                value={formData.type_examen}
                onValueChange={(v) => setFormData({ ...formData, type_examen: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(v) => setFormData({ ...formData, categorie: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      Permis {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date de l'examen *</Label>
              <DatePicker
                value={formData.date_examen}
                onChange={(v) => setFormData({ ...formData, date_examen: v })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heure">Heure *</Label>
              <Input
                id="heure"
                type="time"
                value={formData.heure_examen}
                onChange={(e) => setFormData({ ...formData, heure_examen: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="centre">Centre d'examen *</Label>
              <Input
                id="centre"
                value={formData.centre}
                onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                placeholder="Ex: Centre de tests Plateaux"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu d'examen *</Label>
              <Input
                id="lieu"
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                placeholder="Ex: Abidjan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(v) =>
                  setFormData({ ...formData, statut: v as ExamenSessionStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observations</Label>
            <Textarea
              id="obs"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Notes facultatives..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={loading}>
              {loading ? "Enregistrement..." : session ? "Mettre à jour" : "Créer la session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
