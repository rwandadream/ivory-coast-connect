import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useShallow } from "../_libs/zustand.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, b as formatTel, c as compressImage, f as formatXOF, u as useStore } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-CDJ5ZpoW.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as EmptyState } from "./select-B4NovOgZ.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { t as DatePicker } from "./date-picker-CPq2XPil.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-q9XhTXD3.mjs";
import { t as TelInput } from "./TelInput-CFlhargQ.mjs";
import { t as require_react_webcam } from "../_libs/react-webcam.mjs";
import { t as require_src } from "../_libs/tesseract.js.mjs";
//#region dist/server/assets/eleves-DAZxKSMp.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
var import_react_webcam = /* @__PURE__ */ __toESM(require_react_webcam(), 1);
var import_src = require_src();
function CniScanner({ onScanComplete, onClose }) {
	const webcamRef = (0, import_react.useRef)(null);
	const [imgSrc, setImgSrc] = (0, import_react.useState)(null);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const capture = (0, import_react.useCallback)(() => {
		const imageSrc = webcamRef.current?.getScreenshot();
		if (imageSrc) setImgSrc(imageSrc);
	}, [webcamRef]);
	const processImage = async () => {
		if (!imgSrc) return;
		setIsProcessing(true);
		toast.info("Analyse de la CNI en cours...");
		try {
			const worker = await (0, import_src.createWorker)("fra");
			const { data: { text } } = await worker.recognize(imgSrc);
			await worker.terminate();
			console.log("OCR Result:", text);
			const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 2);
			let nom = "";
			let prenom = "";
			let dob = "";
			lines.forEach((line) => {
				const l = line.toUpperCase();
				if (l.includes("NOM") || l.includes("SURNAME")) nom = line.split(":").pop()?.trim() || line.split(" ").slice(1).join(" ");
				else if (l.includes("PRENOM") || l.includes("GIVEN NAMES")) prenom = line.split(":").pop()?.trim() || line.split(" ").slice(1).join(" ");
				else if (/\d{2}[/.]\d{2}[/.]\d{4}/.test(line)) {
					const match = line.match(/\d{2}[/.]\d{2}[/.]\d{4}/);
					if (match) dob = match[0].replace(/\./g, "-").split("-").reverse().join("-");
				}
			});
			if (!nom && lines.length > 0) nom = lines[0];
			if (!prenom && lines.length > 1) prenom = lines[1];
			onScanComplete({
				nom: nom.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim(),
				prenom: prenom.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim(),
				date_naissance: dob || ""
			});
			toast.success("Analyse terminée !");
		} catch (error) {
			console.error("OCR Error:", error);
			toast.error("Échec de l'analyse. Essayez de taper manuellement.");
		} finally {
			setIsProcessing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-3xl border border-slate-800",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full aspect-[1.6/1] overflow-hidden rounded-2xl bg-black ring-2 ring-primary/20",
				children: [!imgSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_webcam.default, {
					audio: false,
					ref: webcamRef,
					screenshotFormat: "image/jpeg",
					videoConstraints: { facingMode: "environment" },
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: imgSrc,
					alt: "Capture",
					className: "h-full w-full object-cover"
				}), isProcessing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Loader2, { className: "h-10 w-10 animate-spin text-primary mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold uppercase tracking-widest",
						children: "IA en cours..."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 w-full",
				children: !imgSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onClose,
					variant: "ghost",
					className: "flex-1 rounded-xl text-slate-400",
					children: "Annuler"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: capture,
					className: "flex-2 gap-2 bg-primary rounded-xl px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Camera, { className: "h-5 w-5" }), " Capturer"]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setImgSrc(null),
					variant: "outline",
					className: "flex-1 gap-2 rounded-xl border-slate-700",
					disabled: isProcessing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { className: "h-4 w-4" }), " Refaire"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: processImage,
					className: "flex-1 gap-2 bg-green-600 hover:bg-green-700 rounded-xl",
					disabled: isProcessing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { className: "h-4 w-4" }), " Valider & Analyser"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-slate-500 text-center px-4",
				children: "Placez la CNI bien à plat dans le cadre et assurez-vous d'avoir un bon éclairage."
			})
		]
	});
}
const TYPES_PERMIS = [
	"A",
	"B",
	"AB",
	"BCDE",
	"ABCD"
];
const EleveCard = (0, import_react.memo)(({ eleve, onEdit, onDelete, onView }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "group p-3 sm:p-4 transition-all hover:shadow-elegant",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2 sm:gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-xs sm:text-sm font-semibold text-primary-foreground uppercase",
				children: (eleve.prenom?.[0] || "") + (eleve.nom?.[0] || "")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-1 sm:gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm sm:text-base font-semibold text-foreground",
							children: [
								eleve.prenom,
								" ",
								eleve.nom
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "mt-0.5 text-[9px] sm:text-[10px]",
							children: eleve.type_permis
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-0.5 sm:gap-1 lg:opacity-0 transition-opacity lg:group-hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "h-7 w-7 sm:h-8 sm:w-8",
							onClick: () => onEdit(eleve),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { className: "h-3.5 w-3.5 sm:h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "h-7 w-7 sm:h-8 sm:w-8 text-destructive",
							onClick: () => {
								if (confirm(`Supprimer ${eleve.prenom} ${eleve.nom} et toutes ses données associées ?`)) {
									onDelete(eleve.id);
									toast.success("Élève supprimé");
								}
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-3.5 w-3.5" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { className: "h-3 w-3" }),
								" ",
								formatTel(eleve.telephone)
							]
						}),
						eleve.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5 truncate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { className: "h-3 w-3" }),
								" ",
								eleve.email
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70",
							children: ["Dossier ", eleve.dossier_code]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => onView(eleve.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Eye, { className: "mr-1 h-3.5 w-3.5" }), " Voir"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					className: "flex-1",
					onClick: () => onEdit(eleve),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { className: "mr-1 h-3.5 w-3.5" }), " Modifier"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "text-destructive",
					onClick: () => {
						if (confirm(`Supprimer ${eleve.prenom} ${eleve.nom} ?`)) {
							onDelete(eleve.id);
							toast.success("Élève supprimé");
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-3.5 w-3.5" })
				})
			]
		})]
	});
});
function ElevesPage() {
	const { eleves, addEleve, updateEleve, deleteEleve } = useStore(useShallow((s) => ({
		eleves: s.eleves,
		addEleve: s.addEleve,
		updateEleve: s.updateEleve,
		deleteEleve: s.deleteEleve
	})));
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [selectedEleveId, setSelectedEleveId] = (0, import_react.useState)(null);
	const [displayLimit, setDisplayLimit] = (0, import_react.useState)(24);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase();
		return eleves.filter((e) => e.nom.toLowerCase().includes(q) || e.prenom.toLowerCase().includes(q) || e.telephone.includes(search) || e.email && e.email.toLowerCase().includes(q));
	}, [eleves, search]);
	const displayedEleves = (0, import_react.useMemo)(() => {
		return filtered.slice(0, displayLimit);
	}, [filtered, displayLimit]);
	const hasMore = filtered.length > displayLimit;
	const selectedEleve = (0, import_react.useMemo)(() => eleves.find((e) => e.id === selectedEleveId) || null, [eleves, selectedEleveId]);
	const handleOpen = (0, import_react.useCallback)((e) => {
		setEditing(e ?? null);
		setOpen(true);
	}, []);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsClient(true);
	}, []);
	const stats = (0, import_react.useMemo)(() => {
		if (!isClient) return {
			topPermis: "-",
			monthlyCount: 0
		};
		const topPermis = [...TYPES_PERMIS.map((type) => ({
			type,
			count: eleves.filter((e) => e.type_permis === type).length
		}))].sort((a, b) => b.count - a.count)[0]?.type ?? "-";
		const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
		return {
			topPermis,
			monthlyCount: eleves.filter((e) => new Date(e.created_at || "").getMonth() === currentMonth).length
		};
	}, [eleves, isClient]);
	if (!isClient) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Chargement...",
			description: "Accès aux dossiers élèves"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3 xl:grid-cols-4",
			children: [
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "h-32 animate-pulse bg-slate-900/50 border-slate-800" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Élèves",
				description: `${eleves.length} élève${eleves.length > 1 ? "s" : ""} enregistré${eleves.length > 1 ? "s" : ""}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => handleOpen(),
					className: "bg-gradient-primary shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Nouvel élève"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "p-4 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm sm:text-base",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-[10px] sm:text-xs",
								children: "Élèves enregistrés"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-4 sm:p-6 pt-0 sm:pt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl sm:text-3xl font-bold",
								children: eleves.length
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "p-4 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm sm:text-base",
								children: "Nouveau ce mois"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-[10px] sm:text-xs",
								children: "Inscrits ce mois-ci"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-4 sm:p-6 pt-0 sm:pt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl sm:text-3xl font-bold",
								children: stats.monthlyCount
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/70 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "p-4 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm sm:text-base",
								children: "Permis le plus demandé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-[10px] sm:text-xs",
								children: "Préférence actuelle"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-4 sm:p-6 pt-0 sm:pt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl sm:text-3xl font-bold",
								children: stats.topPermis
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden xl:block" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Rechercher par nom, téléphone, email…",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-[200px]",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: import_lucide_react.Users,
					title: eleves.length === 0 ? "Aucun élève" : "Aucun résultat",
					description: eleves.length === 0 ? "Commencez par enregistrer votre premier élève." : "Essayez une autre recherche.",
					action: eleves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => handleOpen(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "mr-1 h-4 w-4" }), " Ajouter un élève"]
					}) : void 0
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
					children: displayedEleves.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EleveCard, {
						eleve: e,
						onEdit: handleOpen,
						onDelete: deleteEleve,
						onView: setSelectedEleveId
					}, e.id))
				}), hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setDisplayLimit((l) => l + 24),
						children: [
							"Charger plus d'élèves (",
							filtered.length - displayLimit,
							" restants)"
						]
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EleveDialog, {
				open,
				onOpenChange: setOpen,
				editing,
				onSubmit: async (data) => {
					if (editing) {
						await updateEleve(editing.id, data);
						toast.success("Élève mis à jour");
					} else {
						await addEleve(data);
						toast.success("Élève ajouté");
					}
					setOpen(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EleveDetailsDialog, {
				eleve: selectedEleve,
				onClose: () => setSelectedEleveId(null)
			})
		]
	});
}
function EleveDialog({ open, onOpenChange, editing, onSubmit }) {
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [showScanner, setShowScanner] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		nom: "",
		prenom: "",
		lieu_naissance: "",
		sexe: "M",
		type_permis: "B",
		telephone: "",
		code: "",
		nationalite: "Ivoirienne",
		type_piece: "CNI",
		num_piece: "",
		date_naissance: "",
		email: "",
		adresse: "",
		date_inscription: "",
		photo_cni: null,
		photo_profil: null,
		inspecteur: "",
		est_parraine: false,
		parrain_nom: ""
	});
	(0, import_react.useEffect)(() => {
		if (open) {
			setShowScanner(false);
			setForm(editing ? {
				nom: editing.nom,
				prenom: editing.prenom,
				lieu_naissance: editing.lieu_naissance ?? "",
				sexe: editing.sexe ?? "M",
				type_permis: editing.type_permis,
				telephone: editing.telephone,
				code: editing.code ?? "",
				nationalite: editing.nationalite ?? "Ivoirienne",
				type_piece: editing.type_piece ?? "CNI",
				num_piece: editing.num_piece ?? "",
				date_naissance: editing.date_naissance ?? "",
				email: editing.email ?? "",
				adresse: editing.adresse ?? "",
				date_inscription: editing.date_inscription ?? "",
				photo_cni: editing.photo_cni ?? null,
				photo_profil: editing.photo_profil ?? null,
				inspecteur: editing.inspecteur ?? "",
				est_parraine: editing.est_parraine ?? false,
				parrain_nom: editing.parrain_nom ?? ""
			} : {
				nom: "",
				prenom: "",
				lieu_naissance: "",
				sexe: "M",
				type_permis: "B",
				telephone: "",
				code: "",
				nationalite: "Ivoirienne",
				type_piece: "CNI",
				num_piece: "",
				date_naissance: "",
				email: "",
				adresse: "",
				date_inscription: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				photo_cni: null,
				photo_profil: null,
				inspecteur: "",
				est_parraine: false,
				parrain_nom: ""
			});
		}
	}, [open, editing]);
	const handleFileChange = async (e, field) => {
		const file = e.target.files?.[0];
		if (file) try {
			const compressed = await compressImage(file);
			setForm((prev) => ({
				...prev,
				[field]: compressed
			}));
			toast.success("Image optimisée et chargée");
		} catch (err) {
			toast.error("Erreur lors du traitement de l'image");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			onOpenAutoFocus: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Modifier l'élève" : "Nouvel élève" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Renseignez les informations de l'élève." })] }), !editing && !showScanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					className: "gap-2 border-primary/30 text-primary hover:bg-primary/10",
					onClick: () => setShowScanner(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-4 w-4" }), " Scanner CNI"]
				})]
			}) }), showScanner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CniScanner, {
				onClose: () => setShowScanner(false),
				onScanComplete: (data) => {
					setForm((prev) => ({
						...prev,
						nom: data.nom || prev.nom,
						prenom: data.prenom || prev.prenom,
						date_naissance: data.date_naissance || prev.date_naissance
					}));
					setShowScanner(false);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[80vh] overflow-y-auto px-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: async (e) => {
						e.preventDefault();
						if (!form.nom.trim() || !form.prenom.trim() || !form.telephone.trim()) {
							toast.error("Nom, prénom et téléphone sont requis");
							return;
						}
						setIsSubmitting(true);
						try {
							await onSubmit(form);
						} catch (err) {
							console.error("Submit error:", err);
							toast.error("Une erreur est survenue lors de l'enregistrement.");
						} finally {
							setIsSubmitting(false);
						}
					},
					className: "grid gap-6 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold uppercase tracking-widest text-primary/70",
									children: "Informations Générales"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "prenom",
											children: "Prénoms *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "prenom",
											value: form.prenom,
											onChange: (e) => setForm({
												...form,
												prenom: e.target.value
											}),
											required: true,
											maxLength: 100
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
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
											maxLength: 50
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ln",
											children: "Lieu de naissance (A)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ln",
											value: form.lieu_naissance,
											onChange: (e) => setForm({
												...form,
												lieu_naissance: e.target.value
											}),
											placeholder: "Ex: Abidjan"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sexe *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.sexe,
											onValueChange: (v) => setForm({
												...form,
												sexe: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "M",
												children: "Masculin"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "F",
												children: "Féminin"
											})] })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Catégorie (Permis) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.type_permis,
											onValueChange: (v) => setForm({
												...form,
												type_permis: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TYPES_PERMIS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: t,
												children: t
											}, t)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "tel",
											children: "Contact (Téléphone) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelInput, {
											id: "tel",
											value: form.telephone,
											onChange: (v) => setForm({
												...form,
												telephone: v
											}),
											required: true
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 pt-4 border-t border-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold uppercase tracking-widest text-primary/70",
									children: "Identification"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "code",
											children: "Code"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "code",
											value: form.code,
											onChange: (e) => setForm({
												...form,
												code: e.target.value
											}),
											placeholder: "Code interne"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "dn",
											children: "Né(e) le *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
											value: form.date_naissance,
											onChange: (v) => setForm({
												...form,
												date_naissance: v
											}),
											required: true
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "nat",
											children: "Nationalité"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "nat",
											value: form.nationalite,
											onChange: (e) => setForm({
												...form,
												nationalite: e.target.value
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type de pièce" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.type_piece,
											onValueChange: (v) => setForm({
												...form,
												type_piece: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "CNI",
													children: "CNI"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Attestation",
													children: "Attestation"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Passeport",
													children: "Passeport"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Carte Consulaire",
													children: "Carte Consulaire"
												})
											] })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "np",
											children: "N° pièce"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "np",
											value: form.num_piece,
											onChange: (e) => setForm({
												...form,
												num_piece: e.target.value
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "di",
											children: "Date d'inscription *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
											value: form.date_inscription,
											onChange: (v) => setForm({
												...form,
												date_inscription: v
											}),
											required: true
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 pt-4 border-t border-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold uppercase tracking-widest text-primary/70",
									children: "Suivi & Parrainage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "inspecteur",
											children: "Inspecteur"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "inspecteur",
											value: form.inspecteur,
											onChange: (e) => setForm({
												...form,
												inspecteur: e.target.value
											}),
											placeholder: "Nom de l'inspecteur"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Élève parrainé ?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.est_parraine ? "OUI" : "NON",
											onValueChange: (v) => setForm({
												...form,
												est_parraine: v === "OUI"
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "NON",
												children: "Non"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "OUI",
												children: "Oui"
											})] })]
										})]
									})]
								}),
								form.est_parraine && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 animate-in fade-in slide-in-from-top-2 duration-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "parrain",
										children: "Parrainé par"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "parrain",
										value: form.parrain_nom,
										onChange: (e) => setForm({
											...form,
											parrain_nom: e.target.value
										}),
										placeholder: "Nom du parrain",
										required: form.est_parraine
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 pt-4 border-t border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold uppercase tracking-widest text-primary/70",
								children: "Photos & Documents"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Carte d'identité (CNI)" }), form.photo_cni ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-900",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: form.photo_cni,
											alt: "CNI",
											className: "h-full w-full object-contain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setForm((prev) => ({
												...prev,
												photo_cni: null
											})),
											className: "absolute right-2 top-2 rounded-full bg-red-500/80 p-1 text-white hover:bg-red-500 transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { className: "h-4 w-4" })
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 transition-all hover:bg-slate-900 hover:border-primary/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { className: "h-6 w-6 text-slate-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-slate-400",
												children: "Cliquez pour charger la CNI"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												className: "hidden",
												accept: "image/*",
												onChange: (e) => handleFileChange(e, "photo_cni")
											})
										]
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-6",
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
				})
			})]
		})
	});
}
function EleveDetailsDialog({ eleve, onClose }) {
	const { factures, paiements, examens, inscriptions, formations, getStatutFacture } = useStore(useShallow((s) => ({
		factures: s.factures,
		paiements: s.paiements,
		examens: s.examens,
		inscriptions: s.inscriptions,
		formations: s.formations,
		getStatutFacture: s.getStatutFacture
	})));
	const eleveFactures = (0, import_react.useMemo)(() => eleve ? factures.filter((f) => f.eleve_id === eleve.id) : [], [eleve, factures]);
	const elevePaiements = (0, import_react.useMemo)(() => eleve ? paiements.filter((p) => p.eleve_id === eleve.id) : [], [eleve, paiements]);
	const eleveExamens = (0, import_react.useMemo)(() => eleve ? examens.filter((x) => x.eleve_id === eleve.id) : [], [eleve, examens]);
	const eleveInscription = (0, import_react.useMemo)(() => eleve ? inscriptions.find((i) => i.eleve_id === eleve.id) : null, [eleve, inscriptions]);
	const formation = (0, import_react.useMemo)(() => eleveInscription ? formations.find((f) => f.id === eleveInscription.formation_id) : null, [eleveInscription, formations]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!eleve,
		onOpenChange: (b) => !b && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			onOpenAutoFocus: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Fiche de l'élève" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Suivez les factures, paiements et examens associés." })] }), eleve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Élève"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-2xl font-semibold",
								children: [
									eleve.prenom,
									" ",
									eleve.nom
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: onClose,
									children: "Fermer"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Contact (Téléphone)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: formatTel(eleve.telephone)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Lieu de naissance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.lieu_naissance || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Catégorie (Permis)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.type_permis
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-800/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.code || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Nationalité"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.nationalite || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Né(e) le"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.date_naissance ? new Date(eleve.date_naissance).toLocaleDateString("fr-FR") : "—"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-800/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Type de pièce"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.type_piece || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "N° pièce"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.num_piece || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Sexe"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.sexe === "M" ? "Masculin" : "Féminin"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-800/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Inspecteur"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.inspecteur || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
									children: "Parrainage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: eleve.est_parraine ? `Parrainé par ${eleve.parrain_nom}` : "Non parrainé"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Factures"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-2xl font-semibold",
										children: eleveFactures.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Paiements"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-2xl font-semibold",
										children: elevePaiements.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Examens"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-2xl font-semibold",
										children: eleveExamens.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Formation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm font-semibold",
										children: formation?.nom || "Aucune"
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-slate-800 bg-slate-950/90 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Dernières Factures"
							}), eleveFactures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: "Aucune facture."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 mt-3",
								children: eleveFactures.slice(0, 3).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: f.numero
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: getStatutFacture(f.id)
									})]
								}, f.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-slate-800 bg-slate-950/90 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Derniers Paiements"
							}), elevePaiements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: "Aucun paiement."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 mt-3",
								children: elevePaiements.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: formatXOF(p.montant)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: new Date(p.date_paiement || p.created_at || "").toLocaleDateString("fr-FR")
									})]
								}, p.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-slate-800 bg-slate-950/90 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Examens"
							}), eleveExamens.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: "Aucun examen."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 mt-3",
								children: eleveExamens.slice(0, 3).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-slate-800 bg-slate-900/80 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: x.type_examen
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: new Date(x.date_examen || "").toLocaleDateString("fr-FR")
									})]
								}, x.id))
							})]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { ElevesPage as component };
