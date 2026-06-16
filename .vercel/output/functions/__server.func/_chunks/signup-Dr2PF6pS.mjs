import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, j as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { B as Button, L as Logo, s as signUp } from "./router-CQ4OfHlr.mjs";
import { n as Label, t as Input } from "./input-CBnYHCr1.mjs";
//#region dist/server/assets/signup-Dr2PF6pS.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
function SignupPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const handleSignup = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { error } = await signUp(email, password, email.split("@")[0]);
			if (error) toast.error("Erreur d'inscription : " + error.message);
			else {
				toast.success("Compte créé ! Vous pouvez désormais vous connecter.");
				navigate({ to: "/login" });
			}
		} catch (error) {
			toast.error("Une erreur inattendue est survenue.");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen w-full items-center justify-center bg-[#050505] overflow-hidden selection:bg-primary/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 z-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop",
				alt: "Premium Car",
				className: "h-full w-full object-cover opacity-40 animate-pulse-subtle scale-110"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-black via-black/60 to-primary/20" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 w-full max-w-[460px] px-6 py-12 animate-fade-in-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass glass-hover rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.7)] border-white/5 p-10 sm:p-14 backdrop-blur-3xl transition-all duration-700",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-12 flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group mb-8 relative flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-6 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative z-10 transition-all duration-500 hover:scale-105",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: 130 })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-4 opacity-50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-black uppercase tracking-[0.4em] text-white/40",
								children: "Créer votre compte"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSignup,
						className: "space-y-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1",
									children: "Email Professionnel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { className: "h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors duration-300" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										placeholder: "directeur@sarahauto.ci",
										className: "h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white placeholder:text-white/10 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-base font-medium",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										required: true
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1",
									children: "Mot de passe"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { className: "h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors duration-300" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										placeholder: "••••••••••••",
										className: "h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white placeholder:text-white/10 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-base font-medium",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										required: true,
										minLength: 6
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-primary text-base font-black text-primary-foreground shadow-glow transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]",
							disabled: isLoading,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative z-10 flex items-center justify-center gap-3",
								children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Loader2, { className: "h-5 w-5 animate-spin" }), "Traitement..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Créer le compte", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" })] })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 flex flex-col items-center gap-8 border-t border-white/5 pt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/30",
								children: "Déjà inscrit ?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								className: "ml-3 font-black text-primary hover:text-primary-glow transition-all duration-300 relative group",
								children: ["Se connecter", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-black text-white/10 uppercase tracking-[0.5em] text-center",
							children: "SARAH AUTO © 2026"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { SignupPage as component };
