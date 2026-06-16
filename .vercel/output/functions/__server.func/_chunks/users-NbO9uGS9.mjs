import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, g as getCurrentUser, u as useStore } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
//#region dist/server/assets/users-NbO9uGS9.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const ROLES = [
	"administrateur_principal",
	"administrateur_secondaire",
	"comptable",
	"moniteur"
];
const ROLE_LABELS = {
	administrateur_principal: "Admin Principal",
	administrateur_secondaire: "Admin Secondaire",
	comptable: "Comptable",
	moniteur: "Moniteur"
};
function UsersPage() {
	const { users, addUser, updateUser, deleteUser } = useStore(useShallow((s) => ({
		users: s.users,
		addUser: s.addUser,
		updateUser: s.updateUser,
		deleteUser: s.deleteUser
	})));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getCurrentUser().then(setCurrentUser);
	}, []);
	const isPrincipal = currentUser?.role === "administrateur_principal";
	const filteredUsers = users.filter((user) => {
		const q = search.toLowerCase();
		return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.role.toLowerCase().includes(q);
	});
	(0, import_react.useEffect)(() => {
		if (!open) setEditing(null);
	}, [open]);
	if (!isPrincipal && currentUser?.role !== "administrateur_secondaire") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[70vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: import_lucide_react.ShieldAlert,
			title: "Accès restreint",
			description: "Vous n'avez pas les permissions nécessaires pour gérer les utilisateurs."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Gestion des utilisateurs",
				description: "Créez des comptes, ajustez les rôles et contrôlez l’accès à la plateforme.",
				actions: isPrincipal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "bg-gradient-primary shadow-glow",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouvel utilisateur"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Comptes" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: users.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Utilisateurs actifs"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Admin Principal" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: users.filter((u) => u.role === "administrateur_principal").length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Contrôle total"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Admin Secondaire" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: users.filter((u) => u.role === "administrateur_secondaire").length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Accès limité"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Autres" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: users.filter((u) => !u.role.startsWith("administrateur")).length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Rôles spécifiques"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Rechercher un utilisateur…",
					className: "pl-3"
				})
			}),
			filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: import_lucide_react.UserPlus,
				title: users.length === 0 ? "Aucun utilisateur" : "Aucun résultat",
				description: users.length === 0 ? "Créez un compte pour commencer la gestion des accès." : "Aucun utilisateur ne correspond à cette recherche."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: filteredUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 transition-all hover:shadow-elegant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: user.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: user.email
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground",
							children: ROLE_LABELS[user.role] || user.role
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Créé le ", new Date(user.created_at).toLocaleDateString("fr-FR")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: isPrincipal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "h-8 w-8 inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors",
								onClick: () => {
									setEditing(user);
									setOpen(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Edit3, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "h-8 w-8 inline-flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 text-destructive rounded-md transition-colors",
								onClick: () => {
									if (confirm(`Supprimer le compte de ${user.name} ?`)) {
										deleteUser(user.id);
										toast.success("Utilisateur supprimé");
									}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-4 w-4" })
							})] })
						})]
					})]
				}, user.id))
			}),
			isPrincipal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserDialog, {
				open,
				editing,
				onOpenChange: setOpen,
				onSubmit: async (payload) => {
					if (editing) {
						await updateUser(editing.id, payload);
						toast.success("Utilisateur mis à jour");
					} else {
						await addUser(payload);
						toast.success("Utilisateur créé");
					}
					setOpen(false);
				}
			})
		]
	});
}
function UserDialog({ open, editing, onOpenChange, onSubmit }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("administrateur_principal");
	const [password, setPassword] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) if (editing) {
			setName(editing.name);
			setEmail(editing.email);
			setRole(editing.role);
			setPassword("");
		} else {
			setName("");
			setEmail("");
			setRole("administrateur_principal");
			setPassword("");
		}
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl",
			onOpenAutoFocus: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Modifier l'utilisateur" : "Nouvel utilisateur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: editing ? "Mettez à jour le rôle ou le nom." : "Créez un nouveau compte pour l'accès à la plateforme." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (event) => {
					event.preventDefault();
					if (!name.trim() || !email.trim() || !role) {
						toast.error("Nom, email et rôle sont requis.");
						return;
					}
					if (!editing && password.trim().length < 6) {
						toast.error("Le mot de passe doit avoir au moins 6 caractères.");
						return;
					}
					const payload = {
						name,
						email,
						role
					};
					if (!editing || password.trim().length > 0) payload.password = password;
					setIsSubmitting(true);
					try {
						await onSubmit(payload);
					} finally {
						setIsSubmitting(false);
					}
				},
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Nom"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rôle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: role,
								onValueChange: (value) => setRole(value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((roleOption) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: roleOption,
									children: ROLE_LABELS[roleOption]
								}, roleOption)) })]
							})]
						}), !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Mot de passe"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: !editing
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							type: "button",
							onClick: () => onOpenChange(false),
							disabled: isSubmitting,
							children: "Annuler"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-gradient-primary",
							disabled: isSubmitting,
							children: isSubmitting ? "Chargement..." : editing ? "Mettre à jour" : "Créer"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { UsersPage as component };
