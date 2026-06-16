import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, i as cn, j as labelResultat, u as useStore } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-CDJ5ZpoW.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { h as format, t as fr } from "../_libs/date-fns.mjs";
import { t as DatePicker } from "./date-picker-CPq2XPil.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
import { a as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-C5_ihASo.mjs";
import { t as Textarea } from "./textarea-kMER_MON.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Bdm_ryKB.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region dist/server/assets/examens-BWr4Nwop.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const STATUS_CONFIG = {
	brouillon: {
		label: "Brouillon",
		color: "bg-slate-500/10 text-slate-500 border-slate-500/20"
	},
	programmée: {
		label: "Programmée",
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
	},
	"en cours": {
		label: "En cours",
		color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
	},
	terminée: {
		label: "Terminée",
		color: "bg-green-500/10 text-green-500 border-green-500/20"
	},
	annulée: {
		label: "Annulée",
		color: "bg-red-500/10 text-red-500 border-red-500/20"
	}
};
function SessionCard({ session, onEdit, onDelete, onView }) {
	const status = STATUS_CONFIG[session.statut] || STATUS_CONFIG.brouillon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden border-border bg-card/70 transition-all hover:shadow-elegant group",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: status.color,
								children: status.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-muted-foreground uppercase tracking-wider",
								children: session.numero_bordereau
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-lg leading-tight group-hover:text-primary transition-colors",
							children: session.titre
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MoreVertical, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => onEdit(session),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { className: "mr-2 h-4 w-4" }), " Modifier"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => onView(session),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Users, { className: "mr-2 h-4 w-4" }), " Gérer les élèves"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => onDelete(session.id),
								className: "text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "mr-2 h-4 w-4" }), " Supprimer"]
							})
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "h-4 w-4 text-primary/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: session.date_examen ? format(new Date(session.date_examen), "dd MMM yyyy", { locale: fr }) : "Non définie" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { className: "h-4 w-4 text-primary/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: session.heure_examen?.slice(0, 5) || "--:--" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted-foreground col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4 text-primary/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: [
									session.centre,
									" • ",
									session.lieu
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 pt-4 border-t border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Users, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium",
								children: [session.eleves_count, " candidat(s)"]
							})]
						}), session.statut === "terminée" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "bg-green-500/10 text-green-600 border-none",
							children: [Math.round(session.taux_reussite || 0), "% succès"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1 bg-gradient-primary shadow-sm",
							size: "sm",
							onClick: () => onView(session),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { className: "mr-2 h-4 w-4" }), " Bordereau"]
						})
					})]
				})
			]
		})
	});
}
const EXAM_TYPES$1 = ["Code", "Conduite"];
const CATEGORIES = [
	"A",
	"B",
	"AB",
	"BCDE",
	"ABCD"
];
const STATUSES = [
	"brouillon",
	"programmée",
	"en cours",
	"terminée",
	"annulée"
];
function SessionDialog({ open, onOpenChange, session, onSave }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		titre: "",
		type_examen: "Code",
		date_examen: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		heure_examen: "08:00",
		centre: "",
		lieu: "",
		categorie: "B",
		statut: "brouillon",
		observations: ""
	});
	(0, import_react.useEffect)(() => {
		if (session) setFormData({
			titre: session.titre,
			type_examen: session.type_examen,
			date_examen: session.date_examen,
			heure_examen: session.heure_examen.slice(0, 5),
			centre: session.centre,
			lieu: session.lieu,
			categorie: session.categorie,
			statut: session.statut,
			observations: session.observations || ""
		});
		else setFormData({
			titre: "",
			type_examen: "Code",
			date_examen: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			heure_examen: "08:00",
			centre: "",
			lieu: "",
			categorie: "B",
			statut: "brouillon",
			observations: ""
		});
	}, [session, open]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSave({
				...formData,
				numero_bordereau: session?.numero_bordereau || `SAE-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(Math.random() * 1e4).toString().padStart(4, "0")}`
			});
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: session ? "Modifier la session" : "Nouvelle session d'examen" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Configurez les détails de la session et le lieu de l'examen." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "grid gap-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "titre",
									children: "Titre de la session *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "titre",
									value: formData.titre,
									onChange: (e) => setFormData({
										...formData,
										titre: e.target.value
									}),
									placeholder: "Ex: Session Code Juin 2026",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type d'examen *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: formData.type_examen,
									onValueChange: (v) => setFormData({
										...formData,
										type_examen: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EXAM_TYPES$1.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Catégorie *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: formData.categorie,
									onValueChange: (v) => setFormData({
										...formData,
										categorie: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: c,
										children: ["Permis ", c]
									}, c)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "date",
									children: "Date de l'examen *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
									value: formData.date_examen,
									onChange: (v) => setFormData({
										...formData,
										date_examen: v
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "heure",
									children: "Heure *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "heure",
									type: "time",
									value: formData.heure_examen,
									onChange: (e) => setFormData({
										...formData,
										heure_examen: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "centre",
									children: "Centre d'examen *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "centre",
									value: formData.centre,
									onChange: (e) => setFormData({
										...formData,
										centre: e.target.value
									}),
									placeholder: "Ex: Centre de tests Plateaux",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "lieu",
									children: "Lieu d'examen *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "lieu",
									value: formData.lieu,
									onChange: (e) => setFormData({
										...formData,
										lieu: e.target.value
									}),
									placeholder: "Ex: Abidjan",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Statut" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: formData.statut,
									onValueChange: (v) => setFormData({
										...formData,
										statut: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										className: "capitalize",
										children: s
									}, s)) })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "obs",
							children: "Observations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "obs",
							value: formData.observations,
							onChange: (e) => setFormData({
								...formData,
								observations: e.target.value
							}),
							placeholder: "Notes facultatives...",
							rows: 3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Annuler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-primary",
						disabled: loading,
						children: loading ? "Enregistrement..." : session ? "Mettre à jour" : "Créer la session"
					})] })
				]
			})]
		})
	});
}
const Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
const ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
const ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function SessionElevesDialog({ open, onOpenChange, sessionId, categorie, existingEleveIds, onAdd }) {
	const { eleves } = useStore();
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const filteredEleves = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase();
		return eleves.filter((e) => {
			const matchesSearch = e.nom.toLowerCase().includes(q) || e.prenom.toLowerCase().includes(q);
			const isNotAdded = !existingEleveIds.includes(e.id);
			return matchesSearch && isNotAdded;
		});
	}, [
		eleves,
		search,
		existingEleveIds
	]);
	const eligibleEleves = (0, import_react.useMemo)(() => {
		return filteredEleves.filter((e) => e.type_permis === categorie);
	}, [filteredEleves, categorie]);
	const toggleEleve = (id) => {
		setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
	};
	const handleAutoAdd = () => {
		const eligibleIds = eligibleEleves.map((e) => e.id);
		setSelectedIds((prev) => Array.from(/* @__PURE__ */ new Set([...prev, ...eligibleIds])));
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Ajouter des élèves" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Sélectionnez les élèves pour la session (Catégorie ",
						categorie,
						")."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-2 text-primary border-primary/30 hover:bg-primary/5",
						onClick: handleAutoAdd,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-4 w-4" }),
							" Éligibles (",
							eligibleEleves.length,
							")"
						]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Rechercher un élève...",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "pl-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "h-[300px] rounded-md border border-border p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: filteredEleves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-sm text-muted-foreground py-8",
									children: "Aucun élève disponible."
								}) : filteredEleves.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											id: e.id,
											checked: selectedIds.includes(e.id),
											onCheckedChange: () => toggleEleve(e.id)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: e.id,
											className: "text-sm font-medium cursor-pointer",
											children: [
												e.prenom,
												" ",
												e.nom,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "ml-2 text-[10px] h-4",
													children: e.type_permis
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-mono",
										children: e.dossier_code
									})]
								}, e.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [selectedIds.length, " élève(s) sélectionné(s)"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Annuler"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "bg-gradient-primary gap-2",
					onClick: handleAdd,
					disabled: loading || selectedIds.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.UserPlus, { className: "h-4 w-4" }), " Ajouter à la session"]
				})] })
			]
		})
	});
}
const Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
const TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
const TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
const TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
const TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
const TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
const TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
const TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
function ResultatsSession({ open, onOpenChange, session, eleves }) {
	const { updateSessionEleve, updateExamenSession } = useStore();
	const [localResults, setLocalResults] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleUpdateLocal = (id, field, value) => {
		setLocalResults((prev) => ({
			...prev,
			[id]: {
				...prev[id] || {
					resultat: eleves.find((e) => e.id === id)?.resultat || "en_attente",
					note: eleves.find((e) => e.id === id)?.note?.toString() || "",
					observations: eleves.find((e) => e.id === id)?.observations || ""
				},
				[field]: value
			}
		}));
	};
	const handleSaveAll = async () => {
		setLoading(true);
		try {
			const promises = Object.entries(localResults).map(([id, data]) => updateSessionEleve(id, {
				resultat: data.resultat,
				note: data.note ? parseFloat(data.note) : null,
				observations: data.observations
			}));
			await Promise.all(promises);
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
		attente: eleves.filter((e) => (localResults[e.id]?.resultat || e.resultat) === "en_attente").length
	};
	const taux = stats.total > 0 ? Math.round(stats.admis / stats.total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Saisie des résultats" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						session.titre,
						" — ",
						session.numero_bordereau
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 px-4 py-2 bg-accent/30 rounded-2xl border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Taux Réussite"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-bold text-primary",
								children: [taux, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center border-l pl-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Admis / Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-bold",
								children: [
									stats.admis,
									" / ",
									stats.total
								]
							})]
						})]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-auto py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Candidat" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Résultat" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-24",
							children: "Note"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Observations" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: eleves.map((e) => {
						const current = localResults[e.id] || {
							resultat: e.resultat,
							note: e.note?.toString() || "",
							observations: e.observations || ""
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: e.nom_complet
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground uppercase",
								children: e.identifiant
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: current.resultat,
								onValueChange: (v) => handleUpdateLocal(e.id, "resultat", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-32",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "en_attente",
										children: "En attente"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "admis",
										className: "text-green-600",
										children: "Admis"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "echec",
										className: "text-red-600",
										children: "Échec"
									})
								] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: current.note,
								onChange: (ev) => handleUpdateLocal(e.id, "note", ev.target.value),
								placeholder: "--"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: current.observations,
								onChange: (ev) => handleUpdateLocal(e.id, "observations", ev.target.value),
								placeholder: "Note facultative..."
							}) })
						] }, e.id);
					}) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-4 border-t flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "gap-1.5 py-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-3 w-3 text-green-600" }),
									" ",
									stats.admis,
									" Admis"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "gap-1.5 py-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.XCircle, { className: "h-3 w-3 text-red-600" }),
									" ",
									stats.echec,
									" Échecs"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "gap-1.5 py-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { className: "h-3 w-3 text-slate-400" }),
									" ",
									stats.attente,
									" En attente"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Annuler"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-primary gap-2",
							onClick: handleSaveAll,
							disabled: loading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Save, { className: "h-4 w-4" }), " Enregistrer tout"]
						})]
					})]
				})
			]
		})
	});
}
const EXAM_TYPES = ["Code", "Conduite"];
const TYPES_PERMIS = [
	"Permis A",
	"Permis B",
	"Permis AB",
	"Permis BCDE",
	"Permis ABCD"
];
function ExamensPage() {
	const { examens, eleves, examen_sessions, examen_session_eleves, addExamen, updateExamen, deleteExamen, addExamenSession, updateExamenSession, deleteExamenSession, addElevesToSession, removeEleveFromSession } = useStore(useShallow((s) => ({
		examens: s.examens,
		eleves: s.eleves,
		examen_sessions: s.examen_sessions,
		examen_session_eleves: s.examen_session_eleves,
		addExamen: s.addExamen,
		updateExamen: s.updateExamen,
		deleteExamen: s.deleteExamen,
		addExamenSession: s.addExamenSession,
		updateExamenSession: s.updateExamenSession,
		deleteExamenSession: s.deleteExamenSession,
		addElevesToSession: s.addElevesToSession,
		removeEleveFromSession: s.removeEleveFromSession
	})));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [sessionDialogOpen, setSessionDialogOpen] = (0, import_react.useState)(false);
	const [elevesDialogOpen, setElevesDialogOpen] = (0, import_react.useState)(false);
	const [resultsDialogOpen, setResultsDialogOpen] = (0, import_react.useState)(false);
	const [editingSession, setEditingSession] = (0, import_react.useState)(null);
	const [activeSession, setActiveSession] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [examFilter, setExamFilter] = (0, import_react.useState)("all");
	const [sessionSearch, setSessionSearch] = (0, import_react.useState)("");
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsClient(true);
	}, []);
	const filtered = (0, import_react.useMemo)(() => examens.filter((e) => (filter === "all" || e.resultat === filter) && (examFilter === "all" || e.type_examen === examFilter)), [
		examens,
		filter,
		examFilter
	]);
	const stats = (0, import_react.useMemo)(() => ({
		enAttente: examens.filter((e) => e.resultat === "en_attente").length,
		admis: examens.filter((e) => e.resultat === "admis").length,
		echecs: examens.filter((e) => e.resultat === "echec").length,
		code: examens.filter((e) => e.type_examen === "Code").length,
		conduite: examens.filter((e) => e.type_examen === "Conduite").length
	}), [examens]);
	const handleOpen = (0, import_react.useCallback)(() => {
		setOpen(true);
	}, []);
	const handleWhatsAppReminder = (ex, eleve) => {
		if (!eleve) return;
		const cleanTel = eleve.telephone.replace(/\D/g, "");
		const dateStr = new Date(ex.date_examen).toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long"
		});
		const message = `Bonjour ${eleve.prenom} ${eleve.nom}, c'est l'auto-école SARAH AUTO. Un petit rappel concernant votre examen de ${ex.type_examen} (${ex.type_permis}) prévu pour le ${dateStr}. N'oubliez pas vos documents originaux. Bon courage !`;
		window.open(`https://wa.me/225${cleanTel}?text=${encodeURIComponent(message)}`, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Examens",
				description: `${examens.length} examen${examens.length > 1 ? "s" : ""} enregistré${examens.length > 1 ? "s" : ""}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setEditingSession(null);
							setSessionDialogOpen(true);
						},
						className: "bg-gradient-primary shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Créer une session"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: handleOpen,
						disabled: eleves.length === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Inscription individuelle"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "sessions",
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted/50 p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "sessions",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ClipboardCheck, { className: "h-4 w-4" }), " Sessions & Bordereaux"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "individuels",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Users, { className: "h-4 w-4" }), " Inscriptions individuelles"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "sessions",
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
											className: "pb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
												className: "text-sm",
												children: "Total Sessions"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-bold",
											children: examen_sessions.length
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
											className: "pb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
												className: "text-sm",
												children: "Programmées"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-bold",
											children: examen_sessions.filter((s) => s.statut === "programmée").length
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
											className: "pb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
												className: "text-sm",
												children: "Terminées"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-bold",
											children: examen_sessions.filter((s) => s.statut === "terminée").length
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
											className: "pb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
												className: "text-sm",
												children: "Candidats Total"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-bold",
											children: examen_session_eleves.length
										}) })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 max-w-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Rechercher une session...",
										className: "pl-9",
										value: sessionSearch,
										onChange: (e) => setSessionSearch(e.target.value)
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
								children: [examen_sessions.filter((s) => s.titre.toLowerCase().includes(sessionSearch.toLowerCase())).map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionCard, {
									session,
									onEdit: (s) => {
										setEditingSession(s);
										setSessionDialogOpen(true);
									},
									onDelete: (id) => {
										if (confirm("Supprimer cette session et tous ses résultats associés ?")) {
											deleteExamenSession(id);
											toast.success("Session supprimée");
										}
									},
									onView: (s) => {
										setActiveSession(s);
										setResultsDialogOpen(true);
									}
								}, session.id)), examen_sessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-full py-12",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
										icon: import_lucide_react.ClipboardCheck,
										title: "Aucune session",
										description: "Commencez par créer votre première session d'examen pour générer des bordereaux.",
										action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => setSessionDialogOpen(true),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-2 h-4 w-4" }), " Créer une session"]
										})
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "individuels",
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm xl:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Examens planifiés" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-bold",
											children: examens.length
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "En attente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Résultats" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-bold",
											children: stats.enAttente
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Admis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Succès" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-bold",
											children: stats.admis
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Échecs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Recalés" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-bold",
											children: stats.echecs
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Théorique" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-bold",
											children: stats.code
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/70 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Conduite" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Pratique" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-bold",
											children: stats.conduite
										}) })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto] items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Filter, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: filter,
										onValueChange: (v) => setFilter(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-48",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "Tous les statuts"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "en_attente",
												children: "En attente"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "admis",
												children: "Admis"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "echec",
												children: "Échec"
											})
										] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Filter, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: examFilter,
										onValueChange: (v) => setExamFilter(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-48",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "Tous les types"
										}), EXAM_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t,
											children: t
										}, t))] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-h-[300px]",
								children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
									icon: import_lucide_react.ClipboardCheck,
									title: examens.length === 0 ? "Aucun examen" : "Aucun résultat",
									description: eleves.length === 0 ? "Créez un élève d'abord." : "Inscrivez un élève."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
									children: filtered.map((ex) => {
										const eleve = eleves.find((e) => e.id === ex.eleve_id);
										const meta = ex.resultat === "admis" ? {
											icon: import_lucide_react.CheckCircle2,
											color: "bg-success/15 text-success border-success/30"
										} : ex.resultat === "echec" ? {
											icon: import_lucide_react.XCircle,
											color: "bg-destructive/15 text-destructive border-destructive/30"
										} : {
											icon: import_lucide_react.Clock,
											color: "bg-warning/20 text-warning-foreground border-warning/40"
										};
										const Icon = meta.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "p-4 transition-all hover:shadow-elegant",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-semibold",
															children: eleve ? `${eleve.prenom} ${eleve.nom}` : "—"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-xs text-muted-foreground",
															children: [
																ex.type_permis,
																" • ",
																ex.type_examen
															]
														}),
														ex.inspecteur && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[10px] font-medium text-primary mt-0.5",
															children: ["Inspecteur: ", ex.inspecteur]
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: meta.color,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mr-1 h-3 w-3" }),
															" ",
															labelResultat(ex.resultat || "en_attente")
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm",
														children: [
															"📅",
															" ",
															isClient ? new Date(ex.date_examen).toLocaleDateString("fr-FR", {
																weekday: "long",
																day: "numeric",
																month: "long"
															}) : "..."
														]
													}), ex.resultat === "en_attente" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-8 w-8 text-green-500 hover:bg-green-500/10",
														onClick: () => handleWhatsAppReminder(ex, eleve),
														title: "Rappeler via WhatsApp",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { className: "h-4 w-4" })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-4 flex gap-1.5",
													children: [ex.resultat === "en_attente" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "flex-1 text-success",
														onClick: () => updateExamen(ex.id, { resultat: "admis" }),
														children: "Admis"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "flex-1 text-destructive",
														onClick: () => updateExamen(ex.id, { resultat: "echec" }),
														children: "Échec"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "text-destructive ml-auto",
														onClick: () => {
															if (confirm("Supprimer ?")) {
																deleteExamen(ex.id);
																toast.success("Supprimé");
															}
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-4 w-4" })
													})]
												})
											]
										}, ex.id);
									})
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamenDialog, {
				open,
				onOpenChange: setOpen,
				onSubmit: async (data) => {
					await addExamen(data);
					toast.success("Examen programmé");
					setOpen(false);
				}
			}, open ? "open" : "closed"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionDialog, {
				open: sessionDialogOpen,
				onOpenChange: setSessionDialogOpen,
				session: editingSession,
				onSave: async (data) => {
					if (editingSession) {
						await updateExamenSession(editingSession.id, data);
						toast.success("Session mise à jour");
					} else {
						await addExamenSession(data);
						toast.success("Session créée");
					}
				}
			}),
			activeSession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultatsSession, {
				open: resultsDialogOpen,
				onOpenChange: setResultsDialogOpen,
				session: activeSession,
				eleves: examen_session_eleves.filter((e) => e.session_id === activeSession.id)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionElevesDialog, {
				open: elevesDialogOpen,
				onOpenChange: setElevesDialogOpen,
				sessionId: activeSession.id,
				categorie: activeSession.categorie,
				existingEleveIds: examen_session_eleves.filter((e) => e.session_id === activeSession.id).map((e) => e.eleve_id),
				onAdd: async (ids) => {
					await addElevesToSession(activeSession.id, ids);
					toast.success(`${ids.length} élève(s) ajouté(s)`);
				}
			})] })
		]
	});
}
function ExamenDialog({ open, onOpenChange, onSubmit }) {
	const { eleves } = useStore(useShallow((s) => ({ eleves: s.eleves })));
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [eleve_id, setEleveId] = (0, import_react.useState)("");
	const [exam_type, setExamType] = (0, import_react.useState)("Code");
	const [type_permis, setTypePermis] = (0, import_react.useState)("Permis B");
	const [date_examen, setDateExamen] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [inspecteur, setInspecteur] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) {
			setEleveId("");
			setExamType("Code");
			setTypePermis("Permis B");
			setDateExamen((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
			setInspecteur("");
			setNotes("");
		}
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Inscrire à un examen" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Programmer une date d'examen pour un élève." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[80vh] overflow-y-auto px-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: async (e) => {
						e.preventDefault();
						if (!eleve_id || !date_examen || eleve_id === "none") {
							toast.error("Élève et date requis");
							return;
						}
						setIsSubmitting(true);
						try {
							await onSubmit({
								eleve_id,
								type_examen: exam_type,
								type_permis,
								date_examen,
								inspecteur: inspecteur || null,
								inspecteur_id: null,
								resultat: "en_attente",
								notes: notes || null,
								formation_id: null
							});
						} catch (err) {
							toast.error("Erreur technique");
						} finally {
							setIsSubmitting(false);
						}
					},
					className: "grid gap-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Élève *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: eleve_id,
								onValueChange: (v) => {
									setEleveId(v);
									if (v !== "none") {
										const e = eleves.find((x) => x.id === v);
										if (e) setTypePermis(`Permis ${e.type_permis}`);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choisir" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									disabled: true,
									children: "Choisir un élève..."
								}), eleves.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: e.id,
									children: [
										e.prenom,
										" ",
										e.nom
									]
								}, e.id))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type d'examen *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: exam_type,
									onValueChange: (v) => setExamType(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EXAM_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type de permis *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type_permis,
									onValueChange: (v) => setTypePermis(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TYPES_PERMIS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "de",
								children: "Date *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
								value: date_examen,
								onChange: setDateExamen,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ins",
								children: "Inspecteur"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ins",
								value: inspecteur,
								onChange: (e) => setInspecteur(e.target.value),
								placeholder: "Nom de l'inspecteur..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nt",
								children: "Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "nt",
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								rows: 2
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
								children: isSubmitting ? "En cours..." : "Programmer"
							})]
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { ExamensPage as component };
