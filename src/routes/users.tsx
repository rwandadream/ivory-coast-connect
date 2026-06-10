import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Plus, UserPlus, Trash2, Edit3 } from "lucide-react";
import { useStore, type User } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = ["administrateur", "comptable", "moniteur", "conseiller"] as const;

type Role = (typeof ROLES)[number];

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Utilisateurs — SARAH AUTO" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useStore(
    useShallow((s) => ({
      users: s.users,
      addUser: s.addUser,
      updateUser: s.updateUser,
      deleteUser: s.deleteUser,
    })),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!open) {
      setEditing(null);
    }
  }, [open]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gestion des utilisateurs"
        description="Créez des comptes, ajustez les rôles et contrôlez l’accès à la plateforme."
        actions={
          <Button className="bg-gradient-primary shadow-glow" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Nouvel utilisateur
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Comptes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Administrateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter((u) => u.role === "administrateur").length}
            </p>
            <p className="text-sm text-muted-foreground">Accès complet</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Moniteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter((u) => u.role === "moniteur").length}
            </p>
            <p className="text-sm text-muted-foreground">Gestion des sessions</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Conseillers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter((u) => u.role === "conseiller").length}
            </p>
            <p className="text-sm text-muted-foreground">Suivi commercial</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur…"
          className="pl-3"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title={users.length === 0 ? "Aucun utilisateur" : "Aucun résultat"}
          description={
            users.length === 0
              ? "Créez un compte pour commencer la gestion des accès."
              : "Aucun utilisateur ne correspond à cette recherche."
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 transition-all hover:shadow-elegant">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {user.role}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Créé le {new Date(user.created_at).toLocaleDateString("fr-FR")}</span>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditing(user);
                      setOpen(true);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      if (confirm(`Supprimer le compte de ${user.name} ?`)) {
                        deleteUser(user.id);
                        toast.success("Utilisateur supprimé");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <UserDialog
        open={open}
        editing={editing}
        onOpenChange={setOpen}
        onSubmit={async (payload) => {
          if (editing) {
            await updateUser(editing.id, payload);
            toast.success("Utilisateur mis à jour");
          } else {
            await addUser(payload as any);
            toast.success("Utilisateur créé");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function UserDialog({
  open,
  editing,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  editing: User | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: Partial<User> & { password?: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("administrateur");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        setName(editing.name);
        setEmail(editing.email);
        setRole(editing.role as Role);
        setPassword("");
      } else {
        setName("");
        setEmail("");
        setRole("administrateur");
        setPassword("");
      }
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Mettez à jour le rôle ou le nom."
              : "Créez un nouveau compte pour l'accès à la plateforme."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!name.trim() || !email.trim() || !role) {
              toast.error("Nom, email et rôle sont requis.");
              return;
            }
            if (!editing && password.trim().length < 6) {
              toast.error("Le mot de passe doit avoir au moins 6 caractères.");
              return;
            }
            const payload: any = { name, email, role };
            if (!editing || password.trim().length > 0) {
              payload.password = password;
            }
            setIsSubmitting(true);
            try {
              await onSubmit(payload);
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="grid gap-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((roleOption) => (
                    <SelectItem key={roleOption} value={roleOption}>
                      {roleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editing}
                />
              </div>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? "Chargement..." : editing ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
