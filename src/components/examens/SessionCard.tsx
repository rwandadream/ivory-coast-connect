import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  MoreVertical,
  FileText,
  Trash2,
  Pencil,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ExamenSession, type ExamenSessionStatus } from "@/lib/store";

const STATUS_CONFIG: Record<ExamenSessionStatus, { label: string; color: string }> = {
  brouillon: { label: "Brouillon", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
  programmée: { label: "Programmée", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  "en cours": { label: "En cours", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  terminée: { label: "Terminée", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  annulée: { label: "Annulée", color: "bg-red-500/10 text-red-500 border-red-500/20" },
};

interface SessionCardProps {
  session: ExamenSession;
  onEdit: (s: ExamenSession) => void;
  onDelete: (id: string) => void;
  onView: (s: ExamenSession) => void;
}

export function SessionCard({ session, onEdit, onDelete, onView }: SessionCardProps) {
  const status = STATUS_CONFIG[session.statut as ExamenSessionStatus] || STATUS_CONFIG.brouillon;

  return (
    <Card className="overflow-hidden border-border bg-card/70 transition-all hover:shadow-elegant group">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={status.color}>
                {status.label}
              </Badge>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {session.numero_bordereau}
              </span>
            </div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {session.titre}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(session)}>
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onView(session)}>
                <Users className="mr-2 h-4 w-4" /> Gérer les élèves
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(session.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/60" />
            <span>
              {session.date_examen
                ? format(new Date(session.date_examen), "dd MMM yyyy", { locale: fr })
                : "Non définie"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/60" />
            <span>{session.heure_examen?.slice(0, 5) || "--:--"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
            <MapPin className="h-4 w-4 text-primary/60" />
            <span className="truncate">
              {session.centre} • {session.lieu}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{session.eleves_count} candidat(s)</span>
            </div>
            {session.statut === "terminée" && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">
                {Math.round(session.taux_reussite || 0)}% succès
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-primary shadow-sm"
              size="sm"
              onClick={() => onView(session)}
            >
              <FileText className="mr-2 h-4 w-4" /> Bordereau
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
