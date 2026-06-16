import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, L as Logo, b as formatTel, f as formatXOF, u as useStore } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label } from "./input-CBnYHCr1.mjs";
import { t as DatePicker } from "./date-picker-CPq2XPil.mjs";
import { t as MoneyInput } from "./money-input-WnaLRSxz.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
//#region dist/server/assets/factures-D9X34koV.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
function FacturesPage() {
	const { factures, eleves, formations, inscriptions, addInscription, deleteInscription, getMontantPaye, getStatutFacture } = useStore(useShallow((s) => ({
		factures: s.factures,
		eleves: s.eleves,
		formations: s.formations,
		inscriptions: s.inscriptions,
		addInscription: s.addInscription,
		deleteInscription: s.deleteInscription,
		getMontantPaye: s.getMontantPaye,
		getStatutFacture: s.getStatutFacture
	})));
	const [openNew, setOpenNew] = (0, import_react.useState)(false);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const statutLabel = {
		non_payee: "Non payée",
		partielle: "Partielle",
		payee: "Payée"
	};
	const statutColor = {
		non_payee: "bg-destructive/15 text-destructive border-destructive/30",
		partielle: "bg-warning/30 text-warning-foreground border-warning",
		payee: "bg-success/15 text-success border-success/30"
	};
	const facturesWithDetails = (0, import_react.useMemo)(() => factures.map((f) => {
		const inscription = inscriptions.find((i) => i.id === f.inscription_id) ?? null;
		return {
			facture: f,
			inscription,
			eleve: eleves.find((e) => e.id === f.eleve_id) ?? null,
			formation: inscription ? formations.find((fr) => fr.id === inscription.formation_id) ?? null : null,
			paye: getMontantPaye(f.id),
			statut: getStatutFacture(f.id)
		};
	}), [
		factures,
		eleves,
		formations,
		inscriptions,
		getMontantPaye,
		getStatutFacture
	]);
	const handleWhatsAppReminder = (item) => {
		const { eleve, facture, paye, statut } = item;
		if (!eleve) return;
		const cleanTel = eleve.telephone.replace(/\D/g, "");
		const reste = facture.montant - paye;
		const message = `Bonjour ${eleve.prenom} ${eleve.nom}, c'est l'auto-école SARAH AUTO. Un petit rappel concernant votre facture ${facture.numero}. Montant total: ${formatXOF(facture.montant)}. Reste à payer: ${formatXOF(reste)}. Merci de régulariser dès que possible.`;
		window.open(`https://wa.me/225${cleanTel}?text=${encodeURIComponent(message)}`, "_blank");
	};
	const { facturesPayees, facturesPartielles, facturesNonPayees } = (0, import_react.useMemo)(() => facturesWithDetails.reduce((acc, item) => {
		acc.facturesPayees += item.statut === "payee" ? 1 : 0;
		acc.facturesPartielles += item.statut === "partielle" ? 1 : 0;
		acc.facturesNonPayees += item.statut === "non_payee" ? 1 : 0;
		return acc;
	}, {
		facturesPayees: 0,
		facturesPartielles: 0,
		facturesNonPayees: 0
	}), [facturesWithDetails]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Factures",
				description: `${factures.length} facture${factures.length > 1 ? "s" : ""} · format SAR-AAAA-NNNN`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpenNew(true),
					className: "bg-gradient-primary shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouvelle inscription"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Factures créées" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: factures.length
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Payées" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Factures réglées" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: facturesPayees
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "En retard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Factures non payées" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: facturesNonPayees
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Partielles" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Paiements partiels" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold",
							children: facturesPartielles
						}) })]
					})
				]
			}),
			factures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: import_lucide_react.FileText,
				title: "Aucune facture",
				description: "Créez une inscription pour générer automatiquement une facture.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpenNew(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouvelle inscription"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border bg-card shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "N° Facture"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Élève"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Formation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Montant"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Payé"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Statut"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y",
							children: facturesWithDetails.map((item) => {
								const { facture: f, eleve, formation, paye, statut, inscription } = item;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 font-mono text-xs font-semibold",
											children: f.numero
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 font-medium",
											children: eleve ? `${eleve.prenom} ${eleve.nom}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-muted-foreground",
											children: formation?.nom ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-right font-semibold",
											children: formatXOF(f.montant)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-right text-success font-medium",
											children: formatXOF(paye)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: statutColor[statut],
												children: statutLabel[statut]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-xs text-muted-foreground",
											children: new Date(f.date_emission || "").toLocaleDateString("fr-FR")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-1",
												children: [
													statut !== "payee" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-7 w-7 text-green-500 hover:bg-green-500/10",
														onClick: () => handleWhatsAppReminder(item),
														title: "Relancer sur WhatsApp",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-7 w-7",
														onClick: () => setViewing(f.id),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Eye, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-7 w-7 text-destructive",
														onClick: () => {
															if (confirm(`Supprimer la facture ${f.numero} et son inscription ?`)) {
																if (inscription) deleteInscription(inscription.id);
																toast.success("Facture supprimée");
															}
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											})
										})
									]
								}, f.id);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NouvelleInscriptionDialog, {
				open: openNew,
				onOpenChange: setOpenNew,
				onSubmit: async (data) => {
					await addInscription(data);
					toast.success("Inscription créée et facture générée");
					setOpenNew(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactureView, {
				factureId: viewing,
				onClose: () => setViewing(null)
			})
		]
	});
}
function NouvelleInscriptionDialog({ open, onOpenChange, onSubmit }) {
	const { eleves, formations } = useStore(useShallow((s) => ({
		eleves: s.eleves,
		formations: s.formations
	})));
	const [eleveId, setEleveId] = (0, import_react.useState)("");
	const [formationId, setFormationId] = (0, import_react.useState)("");
	const [tarif, setTarif] = (0, import_react.useState)(0);
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const formationsActives = formations.filter((f) => f.actif);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (b) => {
			onOpenChange(b);
			if (b) {
				setEleveId("");
				setFormationId("");
				setTarif(0);
				setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nouvelle inscription" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Une facture sera générée automatiquement." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				if (!eleveId || !formationId || tarif <= 0) {
					toast.error("Tous les champs sont requis");
					return;
				}
				setIsSubmitting(true);
				try {
					await onSubmit({
						eleve_id: eleveId,
						formation_id: formationId,
						tarif,
						date_inscription: date
					});
				} finally {
					setIsSubmitting(false);
				}
			},
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Élève *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: eleveId,
					onValueChange: setEleveId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: eleves.length === 0 ? "Aucun élève — créez-en un d'abord" : "Choisir un élève" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: eleves.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: e.id,
						children: [
							e.prenom,
							" ",
							e.nom,
							" — ",
							formatTel(e.telephone)
						]
					}, e.id)) })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Formation *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: formationId,
					onValueChange: (v) => {
						setFormationId(v);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choisir une formation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: formationsActives.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: f.id,
						children: [
							f.nom,
							" — ",
							formatXOF(f.prix ?? 0)
						]
					}, f.id)) })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tarif",
						children: "Tarif appliqué (FCFA) *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyInput, {
						id: "tarif",
						value: tarif,
						onValueChange: (value) => setTarif(value),
						placeholder: "0",
						min: 0,
						max: 999999999999,
						required: true
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "df",
						children: "Date d'émission *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
						value: date,
						onChange: setDate,
						required: true
					})] })]
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
					children: isSubmitting ? "Création..." : "Créer et générer la facture"
				})] })
			]
		})] })
	});
}
function FactureView({ factureId, onClose }) {
	const { factures, eleves, formations, inscriptions, paiements, getMontantPaye, getStatutFacture } = useStore(useShallow((s) => ({
		factures: s.factures,
		eleves: s.eleves,
		formations: s.formations,
		inscriptions: s.inscriptions,
		paiements: s.paiements,
		getMontantPaye: s.getMontantPaye,
		getStatutFacture: s.getStatutFacture
	})));
	const f = factureId ? factures.find((x) => x.id === factureId) : null;
	const eleve = f ? eleves.find((e) => e.id === f.eleve_id) : null;
	const inscription = f ? inscriptions.find((i) => i.id === f.inscription_id) : null;
	const formation = inscription ? formations.find((fr) => fr.id === inscription.formation_id) : null;
	const paye = f ? getMontantPaye(f.id) : 0;
	const reste = f ? f.montant - paye : 0;
	f && getStatutFacture(f.id);
	const factPaiements = f ? paiements.filter((p) => p.facture_id === f.id) : [];
	const handleDownloadPDF = async () => {
		if (!f || !eleve || !formation) return;
		const toastId = toast.loading("Génération du PDF en cours...");
		try {
			const { generateInvoicePDF } = await import("./pdf-generator-BcRW9Xdi.mjs");
			await generateInvoicePDF({
				numero: f.numero,
				date: f.date_emission || "",
				eleve: {
					nom: eleve.nom,
					prenom: eleve.prenom,
					telephone: formatTel(eleve.telephone),
					adresse: eleve.adresse || void 0
				},
				formation: formation.nom,
				montant: f.montant,
				paiements: factPaiements.map((p) => ({
					date: p.date_paiement || p.created_at || "",
					montant: p.montant,
					mode: p.mode_paiement || "especes"
				}))
			});
			toast.success("PDF téléchargé avec succès", { id: toastId });
		} catch (error) {
			console.error(error);
			toast.error("Erreur lors de la génération du PDF", { id: toastId });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!factureId,
		onOpenChange: (b) => !b && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-2xl overflow-y-auto max-h-[90vh]",
			children: f ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: 60 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold text-primary",
									children: "SARAH AUTO"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Auto-école · Centre de Formation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Abidjan, Côte d'Ivoire"
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase font-bold text-muted-foreground",
									children: "Facture"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-lg font-bold",
									children: f.numero
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: new Date(f.date_emission || "").toLocaleDateString("fr-FR")
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
							children: "Destinataire"
						}), eleve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-bold text-base",
									children: [
										eleve.prenom,
										" ",
										eleve.nom
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: formatTel(eleve.telephone)
								}),
								eleve.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: eleve.email
								}),
								eleve.adresse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: eleve.adresse
								})
							]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/50 text-xs uppercase text-muted-foreground font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left",
									children: "Désignation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Montant"
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold",
										children: formation?.nom ?? "Formation"
									}), formation?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: formation.description
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4 text-right font-bold",
									children: formatXOF(f.montant)
								})] })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-[250px] space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: formatXOF(f.montant)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-success",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Déjà payé" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: formatXOF(paye)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t pt-2 text-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-primary",
										children: "Reste à payer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-extrabold text-primary",
										children: formatXOF(reste)
									})]
								})
							]
						})
					}),
					factPaiements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
						children: "Historique des paiements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: factPaiements.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-2 text-xs transition-hover hover:bg-muted/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [
									new Date(p.date_paiement || "").toLocaleDateString("fr-FR"),
									" ·",
									" ",
									p.mode_paiement
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-success",
								children: formatXOF(p.montant)
							})]
						}, p.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:gap-0 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onClose,
							children: "Fermer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => window.print(),
								variant: "secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { className: "mr-2 h-4 w-4" }), " Imprimer"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleDownloadPDF,
								className: "bg-gradient-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { className: "mr-2 h-4 w-4" }), " Télécharger PDF"]
							})]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold",
						children: "Facture introuvable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Cette facture n’est plus disponible. Fermez la fenêtre et réessayez."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
						className: "justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onClose,
							children: "Fermer"
						})
					})
				]
			})
		})
	});
}
//#endregion
export { FacturesPage as component };
