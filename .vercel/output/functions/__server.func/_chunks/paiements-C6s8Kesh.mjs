import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, f as formatXOF, l as labelModePaiement, u as useStore } from "./router-CQ4OfHlr.mjs";
import { o as PageHeader, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { t as DatePicker } from "./date-picker-CPq2XPil.mjs";
import { t as MoneyInput } from "./money-input-WnaLRSxz.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
//#region dist/server/assets/paiements-C6s8Kesh.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const MODE_ICONS = {
	especes: import_lucide_react.Banknote,
	orange_money: import_lucide_react.Smartphone,
	wave: import_lucide_react.Smartphone,
	virement: import_lucide_react.Building
};
function PaiementsPage() {
	const { paiements, factures, eleves, addPaiement, deletePaiement, getMontantPaye } = useStore(useShallow((s) => ({
		paiements: s.paiements,
		factures: s.factures,
		eleves: s.eleves,
		addPaiement: s.addPaiement,
		deletePaiement: s.deletePaiement,
		getMontantPaye: s.getMontantPaye
	})));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsClient(true);
	}, []);
	const total = (0, import_react.useMemo)(() => paiements.reduce((s, p) => s + p.montant, 0), [paiements]);
	const handleOpen = (0, import_react.useCallback)(() => {
		setOpen(true);
	}, []);
	if (!isClient) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Chargement...",
			description: "Accès aux règlements"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-[300px] flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Paiements",
			description: `${paiements.length} paiement${paiements.length > 1 ? "s" : ""} · Total : ${formatXOF(total)}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: handleOpen,
				className: "bg-gradient-primary shadow-glow transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]",
				disabled: factures.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouveau paiement"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-[300px]",
			children: paiements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: import_lucide_react.Wallet,
				title: "Aucun paiement",
				description: factures.length === 0 ? "Créez une facture d'abord." : "Enregistrez un règlement."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: paiements.map((p) => {
					const facture = factures.find((f) => f.id === p.facture_id);
					const eleve = eleves.find((e) => e.id === p.eleve_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex items-center gap-4 p-4 transition-all hover:shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-full bg-success/15 text-success",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MODE_ICONS[p.mode_paiement] || import_lucide_react.Banknote, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: eleve ? `${eleve.prenom} ${eleve.nom}` : "—"
									}), facture && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "font-mono text-[10px]",
										children: facture.numero
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										labelModePaiement(p.mode_paiement || "especes"),
										" ·",
										" ",
										isClient ? new Date(p.date_paiement || "").toLocaleDateString("fr-FR") : "..."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-success",
									children: formatXOF(p.montant)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "text-destructive",
								onClick: () => {
									if (confirm("Supprimer ?")) {
										deletePaiement(p.id);
										toast.success("Supprimé");
									}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-4 w-4" })
							})
						]
					}, p.id);
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaiementDialog, {
			open,
			onOpenChange: setOpen,
			onSubmit: async (data) => {
				await addPaiement(data);
				toast.success("Paiement enregistré");
				setOpen(false);
			}
		}, open ? "open" : "closed")
	] });
}
function PaiementDialog({ open, onOpenChange, onSubmit }) {
	const { factures, eleves, getMontantPaye, getStatutFacture } = useStore(useShallow((s) => ({
		factures: s.factures,
		eleves: s.eleves,
		getMontantPaye: s.getMontantPaye,
		getStatutFacture: s.getStatutFacture
	})));
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [facture_id, setFactureId] = (0, import_react.useState)("");
	const [montant, setMontant] = (0, import_react.useState)(0);
	const [mode_paiement, setMode] = (0, import_react.useState)("especes");
	const [date_paiement, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [reference, setReference] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) {
			setFactureId("");
			setMontant(0);
			setMode("especes");
			setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
			setReference("");
			setNotes("");
		}
	}, [open]);
	const facturesOuvertes = factures.filter((f) => getStatutFacture(f.id) !== "payee");
	const facture = factures.find((f) => f.id === facture_id);
	const reste = facture ? facture.montant - getMontantPaye(facture.id) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nouveau paiement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enregistrer un règlement sur une facture." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (e) => {
					e.preventDefault();
					if (!facture_id || montant <= 0 || !facture) {
						toast.error("Facture et montant requis");
						return;
					}
					setIsSubmitting(true);
					try {
						await onSubmit({
							facture_id,
							eleve_id: facture.eleve_id || "",
							montant,
							mode_paiement,
							date_paiement,
							reference: reference || void 0,
							notes: notes || void 0
						});
					} catch (err) {
						toast.error("Erreur technique");
					} finally {
						setIsSubmitting(false);
					}
				},
				className: "grid gap-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Facture *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: facture_id,
						onValueChange: setFactureId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: facturesOuvertes.length === 0 ? "Aucune facture" : "Choisir" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: facturesOuvertes.map((f) => {
							const e = eleves.find((el) => el.id === f.eleve_id);
							const r = f.montant - getMontantPaye(f.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: f.id,
								children: [
									f.numero,
									" — ",
									e ? `${e.prenom} ${e.nom}` : "—",
									" (",
									formatXOF(r),
									")"
								]
							}, f.id);
						}) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "m",
							children: "Montant (FCFA) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyInput, {
							id: "m",
							value: montant,
							onValueChange: setMontant,
							min: 0,
							max: facture ? reste : 99999999,
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mode *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: mode_paiement,
							onValueChange: (v) => setMode(v),
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
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "d",
							children: "Date *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
							value: date_paiement,
							onChange: setDate,
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ref",
							children: "Référence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ref",
							value: reference,
							onChange: (e) => setReference(e.target.value),
							placeholder: "N° transaction"
						})] })]
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
							children: isSubmitting ? "En cours..." : "Enregistrer"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { PaiementsPage as component };
