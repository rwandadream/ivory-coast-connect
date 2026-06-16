import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, e as downloadCsv, u as useStore } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
import { t as Textarea } from "./textarea-kMER_MON.mjs";
//#region dist/server/assets/planning-DRQyToOg.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const SESSION_TYPES = [
	"Cours",
	"Examen",
	"Rendez-vous"
];
function PlanningPage() {
	const { planning_sessions, moniteurs, eleves, addPlanningSession, updatePlanningSession, deletePlanningSession } = useStore(useShallow((s) => ({
		planning_sessions: s.planning_sessions,
		moniteurs: s.moniteurs,
		eleves: s.eleves,
		addPlanningSession: s.addPlanningSession,
		updatePlanningSession: s.updatePlanningSession,
		deletePlanningSession: s.deletePlanningSession
	})));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [filterMoniteur, setFilterMoniteur] = (0, import_react.useState)("all");
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const editingSession = (0, import_react.useMemo)(() => planning_sessions.find((s) => s.id === editingId) || null, [planning_sessions, editingId]);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsClient(true);
	}, []);
	const moniteurMap = (0, import_react.useMemo)(() => new Map(moniteurs.map((moniteur) => [moniteur.id, moniteur])), [moniteurs]);
	const eleveMap = (0, import_react.useMemo)(() => new Map(eleves.map((eleve) => [eleve.id, eleve])), [eleves]);
	const stats = (0, import_react.useMemo)(() => {
		if (!isClient) return {
			total: planning_sessions.length,
			upcoming: 0,
			actifs: 0
		};
		const now = /* @__PURE__ */ new Date();
		const upcomingSessions = planning_sessions.filter((s) => new Date(s.date_heure) >= now);
		const actifs = new Set(upcomingSessions.filter((s) => s.moniteur_id).map((s) => s.moniteur_id)).size;
		return {
			total: planning_sessions.length,
			upcoming: upcomingSessions.length,
			actifs
		};
	}, [planning_sessions, isClient]);
	const filtered = (0, import_react.useMemo)(() => planning_sessions.filter((s) => {
		const matchM = filterMoniteur === "all" || s.moniteur_id === filterMoniteur;
		const matchT = filterType === "all" || s.type === filterType;
		return matchM && matchT;
	}), [
		planning_sessions,
		filterMoniteur,
		filterType
	]);
	const handleOpen = (0, import_react.useCallback)((session) => {
		setEditingId(session?.id ?? null);
		setOpen(true);
	}, []);
	const handleClose = (0, import_react.useCallback)(() => {
		setOpen(false);
		setTimeout(() => setEditingId(null), 300);
	}, []);
	const exportCsv = () => {
		try {
			downloadCsv([[
				"Titre",
				"Moniteur",
				"Élève",
				"Date / Heure",
				"Durée",
				"Type",
				"Lieu"
			], ...filtered.map((s) => {
				const m = moniteurMap.get(s.moniteur_id ?? "");
				const e = eleveMap.get(s.eleve_id ?? "");
				return [
					s.titre || "",
					m ? `${m.prenom} ${m.nom}` : "-",
					e ? `${e.prenom} ${e.nom}` : "-",
					new Date(s.date_heure).toLocaleString("fr-FR"),
					`${s.duree_minutes} min`,
					s.type || "",
					s.lieu || "-"
				];
			})], `planning-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		} catch (e) {
			toast.error("Export impossible");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Planning",
				description: "Organisez les sessions de formation, rendez-vous et examens.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => handleOpen(),
						className: "bg-gradient-primary shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouvelle session"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "gap-2 flex items-center",
						onClick: exportCsv,
						disabled: filtered.length === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { className: "h-4 w-4" }), " Exporter"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Sessions planifiées" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold text-slate-100",
							children: stats.total
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "À venir" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Sessions prochaines" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold text-slate-100",
							children: stats.upcoming
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Moniteurs actifs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Mobilisés cette semaine" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold text-slate-100",
							children: stats.actifs
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden xl:block" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_auto] items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Filter, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filtrer" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filterMoniteur,
						onValueChange: setFilterMoniteur,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous les moniteurs"
						}), moniteurs.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: m.id,
							children: [
								m.prenom,
								" ",
								m.nom
							]
						}, m.id))] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filterType,
						onValueChange: setFilterType,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous types"
						}), SESSION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: t,
							children: t
						}, t))] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-[300px]",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: import_lucide_react.CalendarDays,
					title: planning_sessions.length === 0 ? "Aucune session" : "Aucun résultat",
					description: planning_sessions.length === 0 ? "Planifiez votre premier cours." : "Ajustez vos filtres."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: filtered.map((s) => {
						const m = moniteurMap.get(s.moniteur_id ?? "");
						const e = eleveMap.get(s.eleve_id ?? "");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 transition-all hover:shadow-elegant",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-slate-100",
										children: s.titre
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: s.type
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300",
										children: isClient ? new Date(s.date_heure).toLocaleString("fr-FR", {
											weekday: "short",
											day: "numeric",
											month: "short",
											hour: "2-digit",
											minute: "2-digit"
										}) : "..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-3 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-slate-200",
												children: "Moniteur:"
											}),
											" ",
											m ? `${m.prenom} ${m.nom}` : "Aucun"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-slate-200",
												children: "Élève:"
											}),
											" ",
											e ? `${e.prenom} ${e.nom}` : "Aucun"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-slate-200",
												children: "Durée:"
											}),
											" ",
											s.duree_minutes,
											" ",
											"min"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-slate-200",
												children: "Lieu:"
											}),
											" ",
											s.lieu || "Non défini"
										] }),
										s.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "italic text-xs border-l-2 border-primary/20 pl-2 mt-1",
											children: s.notes
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => handleOpen(s),
										children: "Modifier"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-destructive hover:bg-destructive/10",
										onClick: () => {
											if (confirm("Supprimer ?")) {
												deletePlanningSession(s.id);
												toast.success("Supprimée");
											}
										},
										children: "Supprimer"
									})]
								})
							]
						}, s.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionDialog, {
				open,
				onOpenChange: (val) => {
					if (!val) handleClose();
					else setOpen(true);
				},
				editing: editingSession,
				moniteurs,
				eleves,
				onSubmit: async (data) => {
					const cleanData = {
						...data,
						moniteur_id: data.moniteur_id === "none" ? null : data.moniteur_id,
						eleve_id: data.eleve_id === "none" ? null : data.eleve_id
					};
					if (editingId) {
						await updatePlanningSession(editingId, cleanData);
						toast.success("Mise à jour effectuée");
					} else {
						await addPlanningSession(cleanData);
						toast.success("Session ajoutée");
					}
					handleClose();
				}
			}, editingId || "new")
		]
	});
}
function SessionDialog({ open, onOpenChange, editing, moniteurs, eleves, onSubmit }) {
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		titre: "",
		eleve_id: "none",
		moniteur_id: "none",
		date_heure: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
		duree_minutes: 60,
		lieu: "",
		type: "Cours",
		notes: ""
	});
	(0, import_react.useEffect)(() => {
		if (open) setForm(editing ? {
			titre: editing.titre || "",
			eleve_id: editing.eleve_id ?? "none",
			moniteur_id: editing.moniteur_id ?? "none",
			date_heure: editing.date_heure,
			duree_minutes: editing.duree_minutes || 60,
			lieu: editing.lieu ?? "",
			type: editing.type || "Formation",
			notes: editing.notes ?? ""
		} : {
			titre: "",
			eleve_id: "none",
			moniteur_id: "none",
			date_heure: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
			duree_minutes: 60,
			lieu: "",
			type: "Cours",
			notes: ""
		});
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Modifier la session" : "Nouvelle session" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Planifiez une session de formation ou un examen." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[80vh] overflow-y-auto px-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: async (e) => {
						e.preventDefault();
						if (!form.titre.trim() || !form.date_heure.trim()) {
							toast.error("Titre et date/heure sont requis");
							return;
						}
						setIsSubmitting(true);
						try {
							await onSubmit(form);
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "titre",
								children: "Titre *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "titre",
								value: form.titre,
								onChange: (e) => setForm({
									...form,
									titre: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Moniteur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.moniteur_id,
									onValueChange: (v) => setForm({
										...form,
										moniteur_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choisir" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Aucun"
									}), moniteurs.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: m.id,
										children: [
											m.prenom,
											" ",
											m.nom
										]
									}, m.id))] })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Élève" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.eleve_id,
									onValueChange: (v) => setForm({
										...form,
										eleve_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choisir" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Aucun"
									}), eleves.map((el) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: el.id,
										children: [
											el.prenom,
											" ",
											el.nom
										]
									}, el.id))] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "date_heure",
									children: "Date / heure *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "date_heure",
									type: "datetime-local",
									value: form.date_heure,
									onChange: (e) => setForm({
										...form,
										date_heure: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "duree_minutes",
									children: "Durée (min)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "duree_minutes",
									type: "number",
									min: 15,
									step: 15,
									value: form.duree_minutes,
									onChange: (e) => setForm({
										...form,
										duree_minutes: Number(e.target.value)
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.type,
									onValueChange: (v) => setForm({
										...form,
										type: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SESSION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "lieu",
									children: "Lieu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "lieu",
									value: form.lieu,
									onChange: (e) => setForm({
										...form,
										lieu: e.target.value
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "notes",
								children: "Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "notes",
								value: form.notes,
								onChange: (e) => setForm({
									...form,
									notes: e.target.value
								}),
								rows: 3
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
								children: isSubmitting ? "En cours..." : editing ? "Mettre à jour" : "Enregistrer"
							})]
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { PlanningPage as component };
