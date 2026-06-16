import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, f as formatXOF, i as cn, u as useStore } from "./router-CQ4OfHlr.mjs";
import { o as PageHeader, t as Card } from "./card-CDJ5ZpoW.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { t as MoneyInput } from "./money-input-WnaLRSxz.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
import { t as Textarea } from "./textarea-kMER_MON.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region dist/server/assets/formations-D3GfuG5T.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function FormationsPage() {
	const { formations, addFormation, updateFormation, deleteFormation } = useStore(useShallow((s) => ({
		formations: s.formations,
		addFormation: s.addFormation,
		updateFormation: s.updateFormation,
		deleteFormation: s.deleteFormation
	})));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const editingFormation = (0, import_react.useMemo)(() => formations.find((f) => f.id === editingId) || null, [formations, editingId]);
	const handleOpen = (0, import_react.useCallback)((f) => {
		setEditingId(f?.id ?? null);
		setOpen(true);
	}, []);
	const handleClose = (0, import_react.useCallback)(() => {
		setOpen(false);
		setTimeout(() => setEditingId(null), 300);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tarifs des Permis",
			description: "Gérez les prix forfaitaires par type de permis (inclut Code + Conduite)",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => handleOpen(),
				className: "bg-gradient-primary shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouveau Permis"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: formations.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: `group relative overflow-hidden p-6 transition-all hover:shadow-elegant ${!f.actif ? "opacity-60" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Car, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: f.actif ? "default" : "secondary",
								className: f.actif ? "bg-success text-success-foreground" : "",
								children: f.actif ? "Actif" : "Désactivé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity",
								onClick: () => {
									if (confirm(`Supprimer le ${f.nom} ?`)) {
										deleteFormation(f.id);
										toast.success("Catégorie supprimée");
									}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-xl font-bold",
						children: f.nom
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground line-clamp-1",
						children: f.description || "Forfait complet Code + Conduite"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground",
							children: "Tarif Forfaitaire"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-3xl font-black text-primary",
							children: formatXOF(f.prix ?? 0)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "flex-1",
							onClick: () => handleOpen(f),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { className: "mr-1 h-3.5 w-3.5" }), " Modifier"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							className: "h-9 w-9",
							onClick: () => updateFormation(f.id, { actif: !f.actif }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Power, { className: "h-4 w-4" })
						})]
					})
				]
			}, f.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormationDialog, {
			open,
			onOpenChange: (val) => {
				if (!val) handleClose();
				else setOpen(true);
			},
			editing: editingFormation,
			onSubmit: async (data) => {
				if (editingId) {
					await updateFormation(editingId, data);
					toast.success("Tarif mis à jour");
				} else {
					await addFormation(data);
					toast.success("Nouveau type de permis créé");
				}
				handleClose();
			}
		}, editingId || "new")
	] });
}
function FormationDialog({ open, onOpenChange, editing, onSubmit }) {
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		nom: "",
		description: "",
		prix: 0,
		actif: true
	});
	(0, import_react.useEffect)(() => {
		if (open) setForm(editing ? {
			nom: editing.nom,
			description: editing.description || "",
			prix: editing.prix,
			actif: editing.actif
		} : {
			nom: "",
			description: "",
			prix: 0,
			actif: true
		});
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			onOpenAutoFocus: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Modifier la formation" : "Nouvelle formation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Définissez le nom, le tarif et la description." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (e) => {
					e.preventDefault();
					if (!form.nom.trim() || (form.prix ?? 0) < 0) {
						toast.error("Nom et tarif requis");
						return;
					}
					setIsSubmitting(true);
					try {
						await onSubmit({
							...form,
							actif: form.actif ?? true,
							prix: form.prix ?? 0
						});
					} catch (err) {
						toast.error("Erreur technique");
					} finally {
						setIsSubmitting(false);
					}
				},
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "nom",
						children: "Nom *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "nom",
						value: form.nom,
						onChange: (e) => setForm({
							...form,
							nom: e.target.value
						}),
						required: true,
						maxLength: 80
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "desc",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "desc",
						value: form.description ?? "",
						onChange: (e) => setForm({
							...form,
							description: e.target.value
						}),
						maxLength: 300,
						rows: 2
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "prix",
						children: "Tarif (FCFA) *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyInput, {
						id: "prix",
						value: form.prix ?? 0,
						onValueChange: (value) => setForm({
							...form,
							prix: value
						}),
						placeholder: "0",
						min: 0,
						max: 999999999999,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Formation active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Disponible pour les nouvelles inscriptions"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: form.actif ?? true,
							onCheckedChange: (c) => setForm({
								...form,
								actif: c
							})
						})]
					}),
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
						children: isSubmitting ? "En cours..." : editing ? "Mettre à jour" : "Créer"
					})] })
				]
			})]
		})
	});
}
//#endregion
export { FormationsPage as component };
