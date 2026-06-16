import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, b as formatTel, u as useStore } from "./router-CQ4OfHlr.mjs";
import { o as PageHeader, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
import { t as TelInput } from "./TelInput-CFlhargQ.mjs";
//#region dist/server/assets/moniteurs-C75xKioz.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const STATUTS = [
	"Disponible",
	"En mission",
	"Absent"
];
function MoniteursPage() {
	const { moniteurs, addMoniteur, updateMoniteur, deleteMoniteur } = useStore(useShallow((s) => ({
		moniteurs: s.moniteurs,
		addMoniteur: s.addMoniteur,
		updateMoniteur: s.updateMoniteur,
		deleteMoniteur: s.deleteMoniteur
	})));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const totalMoniteurs = moniteurs.length;
	const disponibles = (0, import_react.useMemo)(() => moniteurs.filter((m) => m.statut === "Disponible").length, [moniteurs]);
	const enMission = (0, import_react.useMemo)(() => moniteurs.filter((m) => m.statut === "En mission").length, [moniteurs]);
	const handleOpen = (moniteur) => {
		setEditing(moniteur ?? null);
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Moniteurs",
				description: `${totalMoniteurs} moniteur${totalMoniteurs > 1 ? "s" : ""} enregistré${totalMoniteurs > 1 ? "s" : ""}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => handleOpen(),
					className: "bg-gradient-primary shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouveau moniteur"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.24em] text-muted-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-4xl font-semibold",
								children: totalMoniteurs
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.24em] text-muted-foreground",
								children: "Disponibles"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-4xl font-semibold",
								children: disponibles
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.24em] text-muted-foreground",
								children: "En mission"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-4xl font-semibold",
								children: enMission
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden xl:block" })
				]
			}),
			moniteurs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: import_lucide_react.Users,
				title: "Aucun moniteur",
				description: "Ajoutez vos moniteurs pour planifier les cours et les examens.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => handleOpen(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Ajouter un moniteur"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: moniteurs.map((moniteur) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 transition-all hover:shadow-elegant",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-slate-100",
								children: [
									moniteur.prenom,
									" ",
									moniteur.nom
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: moniteur.specialite || "General"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300",
								children: moniteur.statut
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: formatTel(moniteur.telephone) }), moniteur.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: moniteur.email })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => handleOpen(moniteur),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { className: "mr-1 h-3 w-3" }), " Modifier"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "destructive",
								onClick: () => {
									if (confirm(`Supprimer ${moniteur.prenom} ${moniteur.nom} ?`)) {
										deleteMoniteur(moniteur.id);
										toast.success("Moniteur supprimé");
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "mr-1 h-3 w-3" }), " Supprimer"]
							})]
						})
					]
				}, moniteur.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoniteurDialog, {
				open,
				onOpenChange: setOpen,
				editing,
				onSubmit: async (data) => {
					if (editing) {
						await updateMoniteur(editing.id, data);
						toast.success("Moniteur mis à jour");
					} else {
						await addMoniteur(data);
						toast.success("Moniteur ajouté");
					}
					setOpen(false);
				}
			})
		]
	});
}
function MoniteurDialog({ open, onOpenChange, editing, onSubmit }) {
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		nom: "",
		prenom: "",
		telephone: "",
		email: "",
		specialite: "",
		statut: "Disponible"
	});
	(0, import_react.useEffect)(() => {
		if (open) setForm(editing ? {
			nom: editing.nom,
			prenom: editing.prenom,
			telephone: editing.telephone,
			email: editing.email ?? "",
			specialite: editing.specialite ?? "",
			statut: editing.statut || "Disponible"
		} : {
			nom: "",
			prenom: "",
			telephone: "",
			email: "",
			specialite: "",
			statut: "Disponible"
		});
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			onOpenAutoFocus: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Modifier le moniteur" : "Nouveau moniteur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enregistrez les informations de votre moniteur." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (e) => {
					e.preventDefault();
					if (!form.nom.trim() || !form.prenom.trim() || !form.telephone.trim()) {
						toast.error("Nom, prénom et téléphone sont requis");
						return;
					}
					setIsSubmitting(true);
					try {
						await onSubmit(form);
					} finally {
						setIsSubmitting(false);
					}
				},
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "prenom",
							children: "Prénom *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "prenom",
							value: form.prenom,
							onChange: (e) => setForm({
								...form,
								prenom: e.target.value
							}),
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nom",
							children: "Nom *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nom",
							value: form.nom,
							onChange: (e) => setForm({
								...form,
								nom: e.target.value
							}),
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "telephone",
						children: "Téléphone *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelInput, {
						id: "telephone",
						value: form.telephone,
						onChange: (value) => setForm({
							...form,
							telephone: value
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "specialite",
							children: "Spécialité"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "specialite",
							value: form.specialite,
							onChange: (e) => setForm({
								...form,
								specialite: e.target.value
							})
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Statut" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.statut,
						onValueChange: (value) => setForm({
							...form,
							statut: value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUTS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: status,
							children: status
						}, status)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						disabled: isSubmitting,
						children: "Annuler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-primary",
						disabled: isSubmitting,
						children: isSubmitting ? "Chargement..." : editing ? "Mettre à jour" : "Enregistrer"
					})] })
				]
			})]
		})
	});
}
//#endregion
export { MoniteursPage as component };
