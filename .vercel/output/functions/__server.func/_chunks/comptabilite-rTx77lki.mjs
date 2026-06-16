import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, f as formatXOF, g as getCurrentUser, u as useStore } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { t as DatePicker } from "./date-picker-CPq2XPil.mjs";
import { t as MoneyInput } from "./money-input-WnaLRSxz.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuSeparator, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-C5_ihASo.mjs";
//#region dist/server/assets/comptabilite-rTx77lki.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const CATEGORIES = [
	{
		id: "carburant",
		label: "Carburant",
		icon: import_lucide_react.Fuel
	},
	{
		id: "entretien",
		label: "Entretien véhicules",
		icon: import_lucide_react.Wrench
	},
	{
		id: "reparations",
		label: "Réparations",
		icon: import_lucide_react.Wrench
	},
	{
		id: "assurance",
		label: "Assurance",
		icon: import_lucide_react.ShieldCheck
	},
	{
		id: "salaires",
		label: "Salaires",
		icon: import_lucide_react.UserCheck
	},
	{
		id: "fournitures",
		label: "Fournitures",
		icon: import_lucide_react.Package
	},
	{
		id: "autres",
		label: "Autres dépenses",
		icon: import_lucide_react.MoreHorizontal
	}
];
function ComptabilitePage() {
	const { depenses, addDepense, updateDepense, deleteDepense } = useStore(useShallow((s) => ({
		depenses: s.depenses,
		addDepense: s.addDepense,
		updateDepense: s.updateDepense,
		deleteDepense: s.deleteDepense
	})));
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase();
		return depenses.filter((d) => d.categorie.toLowerCase().includes(q) || d.description && d.description.toLowerCase().includes(q));
	}, [depenses, search]);
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: depenses.reduce((sum, d) => sum + d.montant, 0),
			thisMonth: depenses.filter((d) => new Date(d.date).getMonth() === (/* @__PURE__ */ new Date()).getMonth()).reduce((sum, d) => sum + d.montant, 0)
		};
	}, [depenses]);
	const handleOpen = (d) => {
		setEditing(d ?? null);
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Comptabilité & Dépenses",
				description: "Gérez les sorties d'argent et suivez vos coûts d'exploitation.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => handleOpen(),
					className: "bg-gradient-primary shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouvelle dépense"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/70 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 sm:p-6 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-medium flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.TrendingDown, { className: "h-4 w-4 text-red-500" }), "Total des dépenses"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 sm:p-6 pt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: formatXOF(stats.total)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Cumul historique"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/70 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 sm:p-6 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-medium flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "h-4 w-4 text-primary" }), "Dépenses du mois"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 sm:p-6 pt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: formatXOF(stats.thisMonth)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Mois en cours"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Rechercher par catégorie ou description…",
						className: "pl-9"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-[200px]",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: import_lucide_react.TrendingDown,
					title: depenses.length === 0 ? "Aucune dépense" : "Aucun résultat",
					description: depenses.length === 0 ? "Enregistrez votre première dépense pour commencer le suivi." : "Essayez une autre recherche."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4",
					children: filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "group overflow-hidden transition-all hover:shadow-elegant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-4 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
									children: (() => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CATEGORIES.find((c) => c.id === d.categorie)?.icon || import_lucide_react.MoreHorizontal, { className: "h-6 w-6" });
									})()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground",
											children: CATEGORIES.find((c) => c.id === d.categorie)?.label || d.categorie
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] uppercase",
											children: (d.mode_paiement || "especes").replace("_", " ")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1",
										children: new Date(d.date).toLocaleDateString("fr-FR", {
											day: "2-digit",
											month: "long",
											year: "numeric"
										})
									}),
									d.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-1 italic italic",
										children: [
											"\"",
											d.description,
											"\""
										]
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-lg font-bold text-red-500",
										children: ["-", formatXOF(d.montant)]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MoreHorizontal, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => handleOpen(d),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { className: "mr-2 h-4 w-4" }), " Modifier"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											className: "text-destructive",
											onClick: () => {
												if (confirm("Supprimer cette dépense ?")) {
													deleteDepense(d.id);
													toast.success("Dépense supprimée");
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "mr-2 h-4 w-4" }), " Supprimer"]
										})
									]
								})] })]
							})]
						})
					}, d.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepenseDialog, {
				open,
				onOpenChange: setOpen,
				editing,
				onSubmit: async (data) => {
					const user = await getCurrentUser();
					const payload = {
						...data,
						montant: parseFloat(data.montant),
						utilisateur_id: user?.id || "system"
					};
					if (editing) {
						await updateDepense(editing.id, payload);
						toast.success("Dépense mise à jour");
					} else {
						await addDepense(payload);
						toast.success("Dépense ajoutée");
					}
					setOpen(false);
				}
			})
		]
	});
}
function DepenseDialog({ open, onOpenChange, editing, onSubmit }) {
	const [form, setForm] = (0, import_react.useState)({
		categorie: "autres",
		montant: "",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		description: "",
		mode_paiement: "especes",
		vehicule_id: ""
	});
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) if (editing) setForm({
			categorie: editing.categorie,
			montant: editing.montant.toString(),
			date: editing.date,
			description: editing.description || "",
			mode_paiement: editing.mode_paiement || "especes",
			vehicule_id: editing.vehicule_id || ""
		});
		else setForm({
			categorie: "autres",
			montant: "",
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			description: "",
			mode_paiement: "especes",
			vehicule_id: ""
		});
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Modifier la dépense" : "Nouvelle dépense" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enregistrez les détails de la dépense effectuée." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (e) => {
					e.preventDefault();
					if (!form.montant || parseFloat(form.montant) <= 0) {
						toast.error("Le montant doit être supérieur à 0");
						return;
					}
					setIsSubmitting(true);
					try {
						await onSubmit(form);
					} finally {
						setIsSubmitting(false);
					}
				},
				className: "space-y-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "categorie",
							children: "Catégorie"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.categorie,
							onValueChange: (v) => setForm({
								...form,
								categorie: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.id,
								children: c.label
							}, c.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "montant",
								children: "Montant"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyInput, {
								id: "montant",
								value: parseFloat(form.montant) || 0,
								onValueChange: (v) => setForm({
									...form,
									montant: v.toString()
								}),
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "date",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
								value: form.date,
								onChange: (v) => setForm({
									...form,
									date: v
								}),
								required: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mode",
							children: "Mode de paiement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.mode_paiement,
							onValueChange: (v) => setForm({
								...form,
								mode_paiement: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "especes",
									children: "Espèces"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "orange_money",
									children: "Orange Money"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "wave",
									children: "Wave"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "virement",
									children: "Virement"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "description",
							children: "Description (Optionnel)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "description",
							value: form.description,
							onChange: (e) => setForm({
								...form,
								description: e.target.value
							}),
							placeholder: "Ex: Facture CIE, Réparation voiture #3..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { ComptabilitePage as component };
