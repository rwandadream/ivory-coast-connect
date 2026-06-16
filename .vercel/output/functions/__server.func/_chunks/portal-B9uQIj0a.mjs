import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { j as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, a as getSessionId, b as formatTel, c as compressImage, d as clearSession, f as formatXOF } from "./router-CQ4OfHlr.mjs";
import { t as Badge } from "./badge-ClJP_UvT.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Bdm_ryKB.mjs";
import { a as useFormations, c as useStudent, d as useUpdateEleve, l as useStudentFactures, o as useInscriptions, s as usePaiements, u as useStudentPlanning } from "./database.hooks-Cy6lTGE0.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import "../_libs/jspdf-autotable.mjs";
//#region dist/server/assets/portal-B9uQIj0a.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
require_jspdf_node_min();
function StudentPortal() {
	const navigate = useNavigate();
	const studentId = getSessionId();
	const { data: student, isLoading: isLoadingStudent } = useStudent(studentId);
	const { data: studentPlanning = [] } = useStudentPlanning(studentId);
	const { data: studentFactures = [] } = useStudentFactures(studentId);
	const { data: allPaiements = [] } = usePaiements();
	const { data: formations = [] } = useFormations();
	const { data: inscriptions = [] } = useInscriptions();
	const { mutateAsync: updateEleve } = useUpdateEleve();
	const handleProfilePhotoChange = async (e) => {
		const file = e.target.files?.[0];
		if (file && student) try {
			const compressed = await compressImage(file, 400, .8);
			await updateEleve({
				id: student.id,
				data: { photo_profil: compressed }
			});
			toast.success("Photo de profil mise à jour !");
		} catch (err) {
			toast.error("Erreur lors de la mise à jour de la photo");
		}
	};
	const totalMontant = (0, import_react.useMemo)(() => studentFactures.reduce((sum, f) => sum + f.montant, 0), [studentFactures]);
	const totalPaye = (0, import_react.useMemo)(() => allPaiements.filter((p) => p.eleve_id === studentId).reduce((sum, p) => sum + p.montant, 0), [allPaiements, studentId]);
	const resteAPayer = Math.max(0, totalMontant - totalPaye);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setIsClient(true), []);
	const handleLogout = () => {
		clearSession();
		toast.success("Déconnexion réussie");
		navigate({ to: "/login" });
	};
	if (!isClient || isLoadingStudent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-slate-950",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" })
	});
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-bold text-white mb-4",
			children: "Session expirée ou dossier introuvable"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => navigate({ to: "/login" }),
			children: "Retour à la connexion"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-100 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-0 overflow-hidden pointer-events-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-10 px-6 pt-12 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-lg flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "avatar-upload",
								className: "cursor-pointer",
								children: [
									student.photo_profil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: student.photo_profil,
										className: "h-16 w-16 rounded-3xl object-cover ring-2 ring-primary/30 shadow-glow transition-all group-hover:ring-primary group-hover:brightness-75",
										alt: "Profile"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-16 w-16 place-items-center rounded-3xl bg-gradient-primary text-2xl font-black text-white shadow-glow transition-all group-hover:brightness-90",
										children: student.prenom[0]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Camera, { className: "h-6 w-6 text-white" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "avatar-upload",
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handleProfilePhotoChange
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-slate-950 shadow-sm" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-black uppercase tracking-[0.2em] text-primary",
								children: "Candidat Sarah Auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-xl font-black text-white",
								children: [
									student.prenom,
									" ",
									student.nom
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 mt-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-white/10 text-white/50 text-[10px]",
									children: student.dossier_code
								})
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: handleLogout,
						className: "rounded-2xl border-white/5 bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogOut, { className: "h-5 w-5" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto max-w-lg px-6 space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-[2rem] p-5 border-white/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-black uppercase tracking-widest text-white/30",
								children: "Formation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl font-black text-white mt-1",
								children: ["Permis ", student.type_permis]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1 w-full bg-white/5 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-primary w-[65%]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-white/40",
									children: "65%"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-[2rem] p-5 border-white/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-black uppercase tracking-widest text-white/30",
								children: "Compte"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-black text-primary mt-1",
								children: formatXOF(resteAPayer)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold text-white/40 mt-1 uppercase",
								children: "Reste à solder"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "planning",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-2 bg-white/5 rounded-[2rem] p-1.5 h-14 border border-white/5 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "planning",
								className: "rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CalendarDays, { className: "h-4 w-4 mr-2" }), "Planning"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "infos",
								className: "rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.User, { className: "h-4 w-4 mr-2" }), "Mes Infos"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "planning",
							className: "mt-8 space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-black uppercase tracking-[0.2em] text-white/50",
									children: "Mes Cours & Séances"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "bg-white/5 text-white/40 border-none",
									children: [studentPlanning.length, " Séances"]
								})]
							}), studentPlanning.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-16 glass rounded-[2.5rem] border-dashed border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { className: "h-10 w-10 text-white/10 mx-auto mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-white/30 font-bold uppercase tracking-widest",
									children: "Aucune séance prévue"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: studentPlanning.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group glass p-5 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all duration-500 cursor-pointer active:scale-[0.98]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-14 w-14 place-items-center rounded-3xl bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Car, { className: "h-6 w-6" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-black text-white text-lg",
												children: session.titre || "Séance de conduite"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-white/40 uppercase tracking-widest mt-0.5",
												children: new Date(session.date_heure).toLocaleDateString("fr-FR", {
													weekday: "long",
													day: "numeric",
													month: "short"
												})
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-lg font-black text-white",
												children: new Date(session.date_heure).toLocaleTimeString("fr-FR", {
													hour: "2-digit",
													minute: "2-digit"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] font-bold text-primary uppercase tracking-tighter",
												children: [session.duree_minutes || 60, " min"]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex items-center justify-between pt-5 border-t border-white/5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-8 w-8 rounded-xl bg-slate-800 border border-white/10 overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.moniteurs?.nom || "User"}`,
													alt: "Moniteur"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase tracking-tighter text-white/30",
												children: "Moniteur"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs font-bold text-white",
												children: [
													session.moniteurs?.prenom || "À affecter",
													" ",
													session.moniteurs?.nom || ""
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [session.lieu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "border-white/5 text-[10px] text-white/40",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-3 w-3 mr-1" }),
													" ",
													session.lieu
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-3",
												children: session.type || "Formation"
											})]
										})]
									})]
								}, session.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "infos",
							className: "mt-8 space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-black uppercase tracking-[0.2em] text-white/50 px-2",
								children: "Détails de mon profil"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass p-6 rounded-[2.5rem] border-white/5 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.User, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-widest",
												children: "Nom complet"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-bold text-white",
												children: [
													student.prenom,
													" ",
													student.nom
												]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-widest",
												children: "Téléphone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-white",
												children: formatTel(student.telephone)
											})] })]
										}),
										student.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-widest",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-white",
												children: student.email
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-widest",
												children: "Adresse"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-white",
												children: student.adresse || "Non renseignée"
											})] })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass p-6 rounded-[2.5rem] border-white/5 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-[10px] font-black uppercase tracking-widest text-primary",
										children: "Identification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-tighter",
												children: "Né(e) le"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-white",
												children: student.date_naissance ? new Date(student.date_naissance).toLocaleDateString() : "—"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-tighter",
												children: "Sexe"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-white",
												children: student.sexe === "M" ? "Masculin" : "Féminin"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-tighter",
												children: "Type de pièce"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-white",
												children: student.type_piece || "—"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-black uppercase text-white/30 tracking-tighter",
												children: "N° de pièce"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-white",
												children: student.num_piece || "—"
											})] })
										]
									})]
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-8 right-8 z-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://wa.me/2250707070707?text=Bonjour,%20je%20suis%20l'élève%20${student.prenom}%20${student.nom}%20(Code:%20${student.dossier_code}).%20J'ai%20une%20question.`,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex h-16 w-16 items-center justify-center rounded-full bg-green-500 hover:bg-green-600 shadow-glow text-white transition-all duration-300 hover:scale-110 active:scale-95 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { className: "h-7 w-7 transition-transform group-hover:rotate-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-4 border-slate-950 flex items-center justify-center text-[8px] font-black",
						children: "1"
					})]
				})
			})
		]
	});
}
//#endregion
export { StudentPortal as component };
