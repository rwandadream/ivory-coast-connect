import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, e as downloadCsv, f as formatXOF, i as cn, k as buttonVariants } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, t as Card } from "./card-CDJ5ZpoW.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as useFormations, i as useFactures, n as useEleves, o as useInscriptions, r as useExamens, s as usePaiements, t as useDepenses } from "./database.hooks-Cy6lTGE0.mjs";
//#region dist/server/assets/index-DkYzni34.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
const DashboardCharts = (0, import_react.lazy)(() => import("./DashboardCharts-DhU_pqxb.mjs"));
const FinanceChart = (0, import_react.lazy)(() => import("./FinanceChart-CWAEVMKl.mjs"));
const StatCard = (0, import_react.memo)(function StatCard2({ label, value, hint, icon: Icon, accent, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("glass group relative overflow-hidden border-slate-700/70 bg-slate-950/80 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)]", accent && "border-primary/30", "animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"),
		style: { animationDelay: `${index * 150}ms` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-700 group-hover:bg-primary/20 group-hover:scale-150" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-4 sm:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2 sm:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5 sm:space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 group-hover:text-primary transition-colors duration-300",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-all duration-300",
							children: value
						}),
						hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] sm:text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors duration-300",
							children: hint
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("grid h-10 w-10 sm:h-14 sm:w-14 place-items-center rounded-xl sm:rounded-2xl shadow-glow transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:shadow-primary/40", accent ? "bg-gradient-primary text-primary-foreground" : "bg-slate-800 text-slate-100 group-hover:bg-slate-700"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" })
				})]
			})
		})]
	});
});
function Dashboard() {
	const { data: eleves = [], isLoading: isLoadingEleves } = useEleves();
	const { data: formations = [] } = useFormations();
	const { data: factures = [] } = useFactures();
	const { data: paiements = [] } = usePaiements();
	const { data: inscriptions = [] } = useInscriptions();
	const { data: examens = [] } = useExamens();
	const { data: depenses = [] } = useDepenses();
	const isLoading = isLoadingEleves;
	const currentDate = /* @__PURE__ */ new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();
	const facturesWithDetails = (0, import_react.useMemo)(() => factures.map((f) => {
		const inscription = inscriptions.find((i) => i.id === f.inscription_id);
		return {
			facture: f,
			inscription,
			eleve: eleves.find((e) => e.id === f.eleve_id) ?? null,
			formation: inscription ? formations.find((fr) => fr.id === inscription.formation_id) ?? null : null,
			paye: f.montant_paye,
			statut: f.statut
		};
	}), [
		factures,
		eleves,
		inscriptions,
		formations
	]);
	const totalRecouvre = (0, import_react.useMemo)(() => paiements.reduce((sum, p) => sum + p.montant, 0), [paiements]);
	const totalDepenses = (0, import_react.useMemo)(() => depenses.reduce((sum, d) => sum + d.montant, 0), [depenses]);
	const beneficeTotal = totalRecouvre - totalDepenses;
	const examensProgrammes = (0, import_react.useMemo)(() => examens.filter((e) => e.resultat === "en_attente").length, [examens]);
	const admissionCount = (0, import_react.useMemo)(() => examens.filter((e) => e.resultat === "admis").length, [examens]);
	const tauxReussite = (0, import_react.useMemo)(() => examens.length ? Math.round(admissionCount / examens.length * 100) : 0, [admissionCount, examens.length]);
	const paiementsMensuels = (0, import_react.useMemo)(() => paiements.filter((p) => {
		const date = new Date(p.date_paiement || p.created_at || "");
		return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
	}).reduce((sum, p) => sum + p.montant, 0), [
		paiements,
		currentMonth,
		currentYear
	]);
	const depensesMensuelles = (0, import_react.useMemo)(() => depenses.filter((d) => {
		const date = new Date(d.date_depense || d.created_at || "");
		return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
	}).reduce((sum, d) => sum + d.montant, 0), [
		depenses,
		currentMonth,
		currentYear
	]);
	const beneficeMensuel = paiementsMensuels - depensesMensuelles;
	const statusCounts = (0, import_react.useMemo)(() => facturesWithDetails.reduce((acc, item) => {
		if (item.statut === "payee") acc.facturesPayees += 1;
		if (item.statut === "partielle") acc.facturesPartielles += 1;
		if (item.statut === "non_payee") acc.facturesNonPayees += 1;
		acc.facturesToCollect += item.statut !== "payee" ? item.facture.montant - item.paye : 0;
		return acc;
	}, {
		facturesPayees: 0,
		facturesPartielles: 0,
		facturesNonPayees: 0,
		facturesToCollect: 0
	}), [facturesWithDetails]);
	const facturesNonPayees = (0, import_react.useMemo)(() => facturesWithDetails.filter((item) => item.statut === "non_payee"), [facturesWithDetails]);
	const elevesActifs = (0, import_react.useMemo)(() => eleves.filter((eleve) => inscriptions.some((inscription) => inscription.eleve_id === eleve.id)).length, [eleves, inscriptions]);
	const nouveauxCeMois = (0, import_react.useMemo)(() => eleves.filter((e) => {
		const created = new Date(e.created_at || "");
		return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
	}).length, [
		eleves,
		currentMonth,
		currentYear
	]);
	const financeData = (0, import_react.useMemo)(() => [
		{
			name: "Reçu",
			value: totalRecouvre,
			color: "#16a34a"
		},
		{
			name: "Dépenses",
			value: totalDepenses,
			color: "#ef4444"
		},
		{
			name: "Bénéfice",
			value: Math.max(0, beneficeTotal),
			color: "#4f46e5"
		}
	], [
		totalRecouvre,
		totalDepenses,
		beneficeTotal
	]);
	const enrollmentData = (0, import_react.useMemo)(() => {
		const months = [];
		const monthNames = [
			"Jan",
			"Fév",
			"Mar",
			"Avr",
			"Mai",
			"Juin",
			"Juil",
			"Août",
			"Sep",
			"Oct",
			"Nov",
			"Déc"
		];
		for (let offset = 5; offset >= 0; offset -= 1) {
			const date = new Date(currentYear, currentMonth - offset, 1);
			const monthIndex = date.getMonth();
			const year = date.getFullYear();
			const count = eleves.filter((e) => {
				const created = new Date(e.created_at || "");
				return created.getMonth() === monthIndex && created.getFullYear() === year;
			}).length;
			months.push({
				name: monthNames[monthIndex],
				count
			});
		}
		return months;
	}, [
		eleves,
		currentMonth,
		currentYear
	]);
	const recentEleves = (0, import_react.useMemo)(() => eleves.slice(0, 5), [eleves]);
	const handleExportReport = () => {
		try {
			downloadCsv([
				["Clé", "Valeur"],
				["Élèves totaux", `${eleves.length}`],
				["Élèves actifs", `${elevesActifs}`],
				["Nouveaux ce mois", `${nouveauxCeMois}`],
				["Examens programmés", `${examensProgrammes}`],
				["Taux de réussite", `${tauxReussite}%`],
				["Revenus (Total)", `${formatXOF(totalRecouvre)}`],
				["Dépenses (Total)", `${formatXOF(totalDepenses)}`],
				["Bénéfice (Total)", `${formatXOF(beneficeTotal)}`],
				["Revenus mensuels", `${formatXOF(paiementsMensuels)}`],
				["Dépenses mensuelles", `${formatXOF(depensesMensuelles)}`],
				["Bénéfice mensuel", `${formatXOF(beneficeMensuel)}`],
				["Factures impayées", `${statusCounts.facturesNonPayees}`],
				["Montant à recouvrer", `${formatXOF(statusCounts.facturesToCollect)}`]
			], `rapport-financier-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		} catch (error) {
			toast.error("Impossible d'exporter le rapport.");
			console.error(error);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center",
		children: "Chargement du tableau de bord..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 pb-10 bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Centre de pilotage",
				description: "Suivez les indicateurs clés et agissez rapidement.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/eleves",
							className: cn(buttonVariants({
								variant: "default",
								size: "sm"
							}), "gap-2 inline-flex items-center justify-center"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "h-4 w-4" }), "Ajouter un élève"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/planning",
							className: cn(buttonVariants({
								variant: "secondary",
								size: "sm"
							}), "gap-2 inline-flex items-center justify-center"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CalendarDays, { className: "h-4 w-4" }), "Planifier"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "default",
							className: "gap-2 bg-gradient-primary shadow-glow",
							onClick: handleExportReport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { className: "h-4 w-4" }), "Exporter le rapport"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Élèves Totaux",
						value: eleves.length,
						hint: `${nouveauxCeMois} ce mois`,
						icon: import_lucide_react.Users,
						accent: true,
						index: 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Bénéfice Net",
						value: formatXOF(beneficeMensuel),
						hint: "Mois en cours",
						icon: import_lucide_react.TrendingUp,
						index: 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Revenus (Paiements)",
						value: formatXOF(paiementsMensuels),
						hint: "Encaissements du mois",
						icon: import_lucide_react.Wallet,
						index: 2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Dépenses",
						value: formatXOF(depensesMensuelles),
						hint: "Sorties du mois",
						icon: import_lucide_react.FileText,
						index: 3
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-[1.5fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-[280px] flex items-center justify-center",
							children: "Chargement des finances..."
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceChart, { data: financeData })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-glow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "flex items-center justify-between pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-lg font-bold",
								children: "Tendances élèves"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Nouveaux inscrits et progression"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-[320px] w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-56",
									children: "Chargement graphique…"
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardCharts, { enrollmentData })
							})
						}) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000 delay-500 fill-mode-both",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl transition-all hover:border-primary/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-bold",
							children: "Indicateurs clés"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-primary/10 bg-primary/5 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-primary",
											children: "Taux de réussite"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-3xl font-extrabold text-foreground",
											children: [tauxReussite, "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: [
												"Sur ",
												examens.length,
												" examen",
												examens.length > 1 ? "s" : "",
												" enregistrés"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-warning/10 bg-warning/5 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-warning",
											children: "Examens en attente"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-3xl font-extrabold text-foreground",
											children: examensProgrammes
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: "Planifiez les sessions et confirmez les convocations"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-destructive/10 bg-destructive/5 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-destructive",
											children: "Factures à recouvrer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-3xl font-extrabold text-foreground",
											children: formatXOF(facturesNonPayees.reduce((sum, item) => sum + (item.facture.montant - item.paye), 0))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: "Revenus en souffrance"
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-bold",
							children: "Actions rapides"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/eleves",
									className: cn(buttonVariants({
										variant: "outline",
										size: "sm"
									}), "justify-between rounded-2xl px-4 py-4 font-semibold inline-flex w-full"),
									children: "Gérer les élèves"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/factures",
									className: cn(buttonVariants({
										variant: "outline",
										size: "sm"
									}), "justify-between rounded-2xl px-4 py-4 font-semibold inline-flex w-full"),
									children: "Vérifier les factures impayées"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/examens",
									className: cn(buttonVariants({
										variant: "outline",
										size: "sm"
									}), "justify-between rounded-2xl px-4 py-4 font-semibold inline-flex w-full"),
									children: "Planifier un examen"
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl lg:col-span-2 transition-all hover:border-primary/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-bold",
						children: "Dernières inscriptions"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-4",
						children: recentEleves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground py-8 text-center italic",
							children: "Aucun élève inscrit."
						}) : recentEleves.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-300 hover:bg-slate-800 hover:translate-x-2 hover:border-primary/30",
							style: { transitionDelay: `${i * 50}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-sm",
									children: [e.prenom[0], e.nom[0]]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm font-semibold",
										children: [
											e.prenom,
											" ",
											e.nom
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[10px] uppercase tracking-wider text-muted-foreground",
										children: e.type_permis
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] border-primary/20 bg-primary/5 text-primary font-bold px-2",
									children: new Date(e.created_at || "").toLocaleDateString("fr-FR", {
										day: "2-digit",
										month: "short"
									})
								})
							]
						}, e.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-bold",
						children: "Suivi rapide"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-secondary/20 bg-secondary/5 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-secondary",
									children: "Formations disponibles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-3xl font-extrabold text-foreground",
									children: formations.filter((f) => f.actif).length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Catalogue actuel"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-muted/20 bg-muted/10 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Progression des élèves"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Consultez les dossiers individuels pour voir les étapes de formation."
							})]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
