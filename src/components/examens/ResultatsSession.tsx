import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Clock, Save, PieChart } from "lucide-react";
import {
  useStore,
  type ExamenSession,
  type ExamenSessionEleve,
  type ResultatExamen,
} from "@/lib/store";
import { toast } from "sonner";

interface ResultatsSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ExamenSession;
  eleves: ExamenSessionEleve[];
}

export function ResultatsSession({ open, onOpenChange, session, eleves }: ResultatsSessionProps) {
  const { updateSessionEleve, updateExamenSession } = useStore();
  const [localResults, setLocalResults] = useState<
    Record<string, { resultat: string; note: string; observations: string }>
  >({});
  const [loading, setLoading] = useState(false);

  const handleUpdateLocal = (id: string, field: string, value: string) => {
    setLocalResults((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          resultat: eleves.find((e) => e.id === id)?.resultat || "en_attente",
          note: eleves.find((e) => e.id === id)?.note?.toString() || "",
          observations: eleves.find((e) => e.id === id)?.observations || "",
        }),
        [field]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const promises = Object.entries(localResults).map(([id, data]) =>
        updateSessionEleve(id, {
          resultat: data.resultat as ResultatExamen,
          note: data.note ? parseFloat(data.note) : null,
          observations: data.observations,
        }),
      );
      await Promise.all(promises);

      // If all have results, maybe ask to close session
      toast.success("Résultats enregistrés avec succès");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: eleves.length,
    admis: eleves.filter((e) => (localResults[e.id]?.resultat || e.resultat) === "admis").length,
    echec: eleves.filter((e) => (localResults[e.id]?.resultat || e.resultat) === "echec").length,
    attente: eleves.filter((e) => (localResults[e.id]?.resultat || e.resultat) === "en_attente")
      .length,
  };

  const taux = stats.total > 0 ? Math.round((stats.admis / stats.total) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Saisie des résultats</DialogTitle>
              <DialogDescription>
                {session.titre} — {session.numero_bordereau}
              </DialogDescription>
            </div>
            <div className="flex gap-4 px-4 py-2 bg-accent/30 rounded-2xl border border-border">
              <div className="text-center">
                <p className="text-[10px] uppercase text-muted-foreground">Taux Réussite</p>
                <p className="text-lg font-bold text-primary">{taux}%</p>
              </div>
              <div className="text-center border-l pl-4">
                <p className="text-[10px] uppercase text-muted-foreground">Admis / Total</p>
                <p className="text-lg font-bold">
                  {stats.admis} / {stats.total}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Résultat</TableHead>
                <TableHead className="w-24">Note</TableHead>
                <TableHead>Observations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eleves.map((e) => {
                const current = localResults[e.id] || {
                  resultat: e.resultat,
                  note: e.note?.toString() || "",
                  observations: e.observations || "",
                };
                return (
                  <TableRow key={e.id}>
                    <TableCell>
                      <p className="font-medium">{e.nom_complet}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{e.identifiant}</p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={current.resultat}
                        onValueChange={(v) => handleUpdateLocal(e.id, "resultat", v)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="admis" className="text-green-600">
                            Admis
                          </SelectItem>
                          <SelectItem value="echec" className="text-red-600">
                            Échec
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={current.note}
                        onChange={(ev) => handleUpdateLocal(e.id, "note", ev.target.value)}
                        placeholder="--"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={current.observations}
                        onChange={(ev) => handleUpdateLocal(e.id, "observations", ev.target.value)}
                        placeholder="Note facultative..."
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5 py-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" /> {stats.admis} Admis
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1">
              <XCircle className="h-3 w-3 text-red-600" /> {stats.echec} Échecs
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1">
              <Clock className="h-3 w-3 text-slate-400" /> {stats.attente} En attente
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              className="bg-gradient-primary gap-2"
              onClick={handleSaveAll}
              disabled={loading}
            >
              <Save className="h-4 w-4" /> Enregistrer tout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
