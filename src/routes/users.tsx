import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { Plus, UserPlus, Trash2, Edit3, ShieldAlert } from "lucide-react";
import { useStore, type User } from "@/lib/store";
import { type AuthUser, getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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

const ROLES = [
  "administrateur_principal",
  "administrateur_secondaire",
  "comptable",
  "moniteur",
] as const;

type Role = (typeof ROLES)[number];

const ROLE_LABELS: Record<string, string> = {
  administrateur_principal: "Admin Principal",
  administrateur_secondaire: "Admin Secondaire",
  comptable: "Comptable",
  moniteur: "Moniteur",
};

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
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  const isPrincipal = currentUser?.role === "administrateur_principal";

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

  if (!isPrincipal && currentUser?.role !== "administrateur_secondaire") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <EmptyState
          icon={ShieldAlert}
          title="Accès restreint"
          description="Vous n'avez pas les permissions nécessaires pour gérer les utilisateurs."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gestion des utilisateurs"
        description="Créez des comptes, ajustez les rôles et contrôlez l’accès à la plateforme."
        actions={
          isPrincipal && (
            <Button className="bg-gradient-primary shadow-glow" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Nouvel utilisateur
            </Button>
          )
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
            <CardTitle>Admin Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter((u) => u.role === "administrateur_principal").length}
            </p>
            <p className="text-sm text-muted-foreground">Contrôle total</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Admin Secondaire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter((u) => u.role === "administrateur_secondaire").length}
            </p>
            <p className="text-sm text-muted-foreground">Accès limité</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardHeader>
            <CardTitle>Autres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {users.filter((u) => !u.role.startsWith("administrateur")).length}
            </p>
            <p className="text-sm text-muted-foreground">Rôles spécifiques</p>
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
                  {ROLE_LABELS[user.role] || user.role}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Créé le {new Date(user.created_at).toLocaleDateString("fr-FR")}</span>
                <div className="flex gap-1">
                  {isPrincipal && (
                    <>
                      <button
                        className="h-8 w-8 inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        onClick={() => {
                          setEditing(user);
                          setOpen(true);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        className="h-8 w-8 inline-flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 text-destructive rounded-md transition-colors"
                        onClick={() => setDeleteTarget(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isPrincipal && (
        <UserDialog
          open={open}
          editing={editing}
          onOpenChange={setOpen}
          onSubmit={async (payload) => {
            if (editing) {
              await updateUser(editing.id, payload);
              toast.success("Utilisateur mis à jour");
            } else {
              await addUser(payload as Omit<AuthUser, "id" | "created_at">);
              toast.success("Utilisateur créé");
            }
            setOpen(false);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cet utilisateur ?"
        description={
          deleteTarget
            ? `Le compte de ${deleteTarget.name} (${deleteTarget.email}) sera définitivement supprimé. Il ne pourra plus se connecter à la plateforme.`
            : undefined
        }
        confirmLabel="Supprimer le compte"
        onConfirm={() => {
          if (deleteTarget) {
            deleteUser(deleteTarget.id);
            toast.success("Utilisateur supprimé");
            setDeleteTarget(null);
          }
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
  const [role, setRole] = useState<Role>("administrateur_principal");
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
        setRole("administrateur_principal");
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
            const payload: Partial<User> & { password?: string } = { name, email, role };
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
                      {ROLE_LABELS[roleOption]}
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
