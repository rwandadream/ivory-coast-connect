import { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sparkles, UserPlus } from "lucide-react";
import { useStore, type Eleve } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface SessionElevesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  categorie: string;
  existingEleveIds: string[];
  onAdd: (eleveIds: string[]) => Promise<void>;
}

export function SessionElevesDialog({
  open,
  onOpenChange,
  sessionId,
  categorie,
  existingEleveIds,
  onAdd,
}: SessionElevesDialogProps) {
  const { eleves } = useStore();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredEleves = useMemo(() => {
    const q = search.toLowerCase();
    return eleves.filter((e) => {
      const matchesSearch = e.nom.toLowerCase().includes(q) || e.prenom.toLowerCase().includes(q);
      const isNotAdded = !existingEleveIds.includes(e.id);
      return matchesSearch && isNotAdded;
    });
  }, [eleves, search, existingEleveIds]);

  const eligibleEleves = useMemo(() => {
    return filteredEleves.filter((e) => e.type_permis === categorie);
  }, [filteredEleves, categorie]);

  const toggleEleve = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAutoAdd = () => {
    const eligibleIds = eligibleEleves.map((e) => e.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...eligibleIds])));
  };

  const handleAdd = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await onAdd(selectedIds);
      setSelectedIds([]);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Ajouter des élèves</DialogTitle>
              <DialogDescription>
                Sélectionnez les élèves pour la session (Catégorie {categorie}).
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-primary border-primary/30 hover:bg-primary/5"
              onClick={handleAutoAdd}
            >
              <Sparkles className="h-4 w-4" /> Éligibles ({eligibleEleves.length})
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un élève..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border border-border p-4">
            <div className="space-y-3">
              {filteredEleves.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Aucun élève disponible.
                </p>
              ) : (
                filteredEleves.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={e.id}
                        checked={selectedIds.includes(e.id)}
                        onCheckedChange={() => toggleEleve(e.id)}
                      />
                      <label htmlFor={e.id} className="text-sm font-medium cursor-pointer">
                        {e.prenom} {e.nom}
                        <Badge variant="outline" className="ml-2 text-[10px] h-4">
                          {e.type_permis}
                        </Badge>
                      </label>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">
                      {e.dossier_code}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <p className="text-xs text-muted-foreground">
            {selectedIds.length} élève(s) sélectionné(s)
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-primary gap-2"
            onClick={handleAdd}
            disabled={loading || selectedIds.length === 0}
          >
            <UserPlus className="h-4 w-4" /> Ajouter à la session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
