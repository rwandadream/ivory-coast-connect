import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, j as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, L as Logo, h as signIn, u as useStore, v as validateStudentCredentials } from "./router-CQ4OfHlr.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Bdm_ryKB.mjs";
//#region dist/server/assets/login-DTRHSJEq.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
function LoginPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [dossierCode, setDossierCode] = (0, import_react.useState)("");
	const [telephone, setTelephone] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const eleves = useStore((s) => s.eleves);
	const handleAdminLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { data, error } = await signIn(email, password);
			if (error) toast.error(error.message);
			else if (data.user) {
				toast.success("Bienvenue");
				navigate({ to: "/" });
			}
		} catch (error) {
			toast.error("Une erreur est survenue.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleStudentLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const result = validateStudentCredentials(dossierCode, telephone, eleves);
			if (result.error || !result.eleve) toast.error(result.error || "Identifiants invalides.");
			else {
				localStorage.setItem("sarah_auto_session_id", result.eleve.id);
				localStorage.setItem("sarah_auto_session_type", "eleve");
				toast.success("Bienvenue dans votre espace, " + result.eleve.prenom);
				navigate({ to: "/portal" });
			}
		} catch (error) {
			toast.error("Une erreur est survenue.");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen w-full items-center justify-center bg-[#050505] overflow-hidden selection:bg-primary/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 z-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2000&auto=format&fit=crop",
				alt: "Premium Architecture",
				className: "h-full w-full object-cover opacity-40 scale-110"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-black via-black/60 to-primary/20" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 w-full max-w-[500px] px-6 py-12 animate-fade-in-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass glass-hover rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.7)] border-white/5 p-8 sm:p-12 backdrop-blur-3xl transition-all duration-700",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 flex flex-col items-center text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group mb-6 relative flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-6 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative z-10 transition-all duration-500 hover:scale-105",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: 130 })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "student",
						className: "w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1 mb-8 border border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "student",
									className: "rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest",
									children: "Espace Élève"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "admin",
									className: "rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest",
									children: "Administration"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "admin",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleAdminLogin,
									className: "space-y-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1",
												children: "Email Pro"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "email",
													placeholder: "admin@sarahauto.ci",
													className: "h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
													value: email,
													onChange: (e) => setEmail(e.target.value),
													required: true
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1",
												children: "Code Secret"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "password",
													placeholder: "••••••••••••",
													className: "h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
													value: password,
													onChange: (e) => setPassword(e.target.value),
													required: true
												})]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "h-14 w-full rounded-2xl bg-gradient-primary font-black text-primary-foreground shadow-glow",
										disabled: isLoading,
										children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Loader2, { className: "h-5 w-5 animate-spin" }) : "Accéder à l'Admin"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "student",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleStudentLogin,
									className: "space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1",
													children: "Code Dossier"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Hash, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "DOS-2026-XXXX",
														className: "h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
														value: dossierCode,
														onChange: (e) => setDossierCode(e.target.value),
														required: true
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1",
													children: "N° Téléphone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "tel",
														placeholder: "07 00 00 00 00",
														className: "h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
														value: telephone,
														onChange: (e) => setTelephone(e.target.value),
														required: true
													})]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "h-14 w-full rounded-2xl bg-gradient-primary font-black text-primary-foreground shadow-glow",
											disabled: isLoading,
											children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Loader2, { className: "h-5 w-5 animate-spin" }) : "Consulter mon dossier"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-[10px] text-white/30 px-4",
											children: "Vos identifiants se trouvent sur votre contrat d'inscription."
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 pt-8 border-t border-white/5 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/30",
								children: "Nouveau collaborateur ?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signup",
								className: "ml-3 font-black text-primary hover:underline",
								children: "Créer un compte"
							})]
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
