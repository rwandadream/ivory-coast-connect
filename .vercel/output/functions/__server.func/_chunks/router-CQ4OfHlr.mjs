import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, i as Slot } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { M as useRouter, _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, j as useNavigate, l as useLocation, m as lazyRouteComponent, p as Outlet, s as Scripts, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useShallow, t as create } from "../_libs/zustand.mjs";
import { n as toast, t as Toaster$1 } from "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as require_main } from "../_libs/@supabase/ssr+[...].mjs";
//#region dist/server/assets/router-CQ4OfHlr.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lucide_react = require_lucide_react();
var import_main = require_main();
const appCss = "/assets/styles-Blf9Y2_I.css";
const Toaster = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function downloadCsv(rows, fileName) {
	const csvContent = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, "\"\"")}"`).join(",")).join("\r\n");
	if (typeof window === "undefined") return;
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	link.style.display = "none";
	link.target = "_blank";
	if (document.body) document.body.appendChild(link);
	try {
		link.click();
	} finally {
		link.remove();
		URL.revokeObjectURL(url);
	}
}
function compressImage(file, maxWidth = 800, quality = .7) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target?.result;
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let width = img.width;
				let height = img.height;
				if (width > maxWidth) {
					height = maxWidth / width * height;
					width = maxWidth;
				}
				canvas.width = width;
				canvas.height = height;
				canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/jpeg", quality));
			};
			img.onerror = reject;
		};
		reader.onerror = reject;
	});
}
function createSupabaseBrowserClient() {
	return (0, import_main.createBrowserClient)("https://wibhubjxruoftnqqescx.supabase.co", "sb_publishable_xFAaiI5wltqbftXTd7cXMA_NcMJwfff");
}
const supabase = createSupabaseBrowserClient();
async function getSession() {
	const { data: { session }, error } = await supabase.auth.getSession();
	if (error) return null;
	return session;
}
async function getCurrentUser() {
	const { data: { user }, error } = await supabase.auth.getUser();
	if (error || !user) return null;
	const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
	if (!profile) return null;
	return {
		id: user.id,
		email: user.email,
		name: profile.name || user.email?.split("@")[0] || "",
		role: profile.role,
		created_at: profile.created_at
	};
}
function clearSession() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("sarah_auto_session_id");
		localStorage.removeItem("sarah_auto_session_type");
	}
	supabase.auth.signOut().catch(console.error);
}
function getSessionId() {
	if (typeof window !== "undefined") return localStorage.getItem("sarah_auto_session_id");
	return null;
}
async function signIn(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});
	return {
		data,
		error
	};
}
async function signUp(email, password, name) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: { name } }
	});
	return {
		data,
		error
	};
}
function validateStudentCredentials(dossierCode, telephone, eleves) {
	const cleanInputTel = telephone.replace(/\D/g, "");
	const eleve = eleves.find((e) => e.dossier_code?.toLowerCase() === dossierCode.toLowerCase().trim() && e.telephone.replace(/\D/g, "").includes(cleanInputTel));
	if (!eleve) return { error: "Identifiants invalides (Vérifiez le code dossier et le téléphone)." };
	return { eleve };
}
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
const Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Logo({ size = 100, className = "", useBrandColor = true }) {
	const color = useBrandColor ? "#004aad" : "currentColor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 200",
		width: size,
		height: size,
		className,
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "62.7,10 137.3,10 190,62.7 190,137.3 137.3,190 62.7,190 10,137.3 10,62.7",
				fill: "white",
				stroke: color,
				strokeWidth: "7",
				strokeLinejoin: "miter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "66.9,20 133.1,20 180,66.9 180,133.1 133.1,180 66.9,180 20,133.1 20,66.9",
				fill: "none",
				stroke: color,
				strokeWidth: "2.5",
				strokeLinejoin: "miter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				id: "groupe-path",
				d: "M 38,70 A 68,68 0 0,1 162,70",
				fill: "none",
				stroke: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				fontFamily: "system-ui, -apple-system, sans-serif",
				fontWeight: "900",
				fontSize: "21",
				fill: "white",
				stroke: color,
				strokeWidth: "2",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textPath", {
					href: "#groupe-path",
					startOffset: "50%",
					textAnchor: "middle",
					children: "GROUPE"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "100,42 112.9,81.2 152.3,82 120.9,105.8 132.3,143.5 100,121 67.7,143.5 79.1,105.8 47.7,82 87.1,81.2",
				fill: color,
				stroke: color,
				strokeWidth: "1.5",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: "translate(100, 93) scale(0.9)",
				fill: "none",
				stroke: "white",
				strokeWidth: "4",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 6,-8 C 6,-8 2,-13 -4,-13 C -11,-13 -17,-8 -17,0 C -17,8 -11,13 -4,13 C 2,13 7,9 7,2 L 7,0 L -2,0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 14,-9 C 14,-13 9,-13 6,-9 C 3,-5 11,-4 8,2 C 5,8 -1,8 -4,6" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "167",
				fontFamily: "system-ui, -apple-system, sans-serif",
				fontWeight: "900",
				fontSize: "26",
				letterSpacing: "3",
				fill: "white",
				stroke: color,
				strokeWidth: "2.5",
				strokeLinejoin: "round",
				textAnchor: "middle",
				children: "SARAH"
			})
		]
	});
}
const navItems = [
	{
		to: "/",
		label: "Tableau de bord",
		icon: import_lucide_react.LayoutDashboard,
		exact: true
	},
	{
		to: "/eleves",
		label: "Élèves",
		icon: import_lucide_react.Users
	},
	{
		to: "/moniteurs",
		label: "Moniteurs",
		icon: import_lucide_react.UserCircle
	},
	{
		to: "/formations",
		label: "Formations",
		icon: import_lucide_react.GraduationCap
	},
	{
		to: "/planning",
		label: "Planning",
		icon: import_lucide_react.CalendarDays
	},
	{
		to: "/factures",
		label: "Factures",
		icon: import_lucide_react.FileText
	},
	{
		to: "/paiements",
		label: "Paiements",
		icon: import_lucide_react.Wallet
	},
	{
		to: "/comptabilite",
		label: "Comptabilité",
		icon: import_lucide_react.BarChart3
	},
	{
		to: "/examens",
		label: "Examens",
		icon: import_lucide_react.ClipboardCheck
	},
	{
		to: "/users",
		label: "Utilisateurs",
		icon: import_lucide_react.ShieldCheck
	}
];
const breadcrumbLabels = {
	"": "Tableau de bord",
	eleves: "Élèves",
	moniteurs: "Moniteurs",
	formations: "Formations",
	planning: "Planning",
	factures: "Factures",
	paiements: "Paiements",
	comptabilite: "Comptabilité",
	examens: "Examens",
	users: "Utilisateurs"
};
function AppShell({ children, sessionId, sessionType }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const [theme, setTheme] = (0, import_react.useState)("light");
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const segments = pathname.split("/").filter(Boolean);
	const isAdmin = sessionId && sessionType === "admin";
	(0, import_react.useEffect)(() => {
		setMobileMenuOpen(false);
	}, [pathname]);
	const breadcrumbs = (0, import_react.useMemo)(() => segments.map((segment, index) => ({
		label: breadcrumbLabels[segment] ?? segment,
		href: `/${segments.slice(0, index + 1).join("/")}`
	})), [segments]);
	const activeSection = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Tableau de bord";
	(0, import_react.useEffect)(() => {
		const storedTheme = window.localStorage.getItem("sarah_auto_theme");
		const preferredTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		setTheme(preferredTheme);
		document.documentElement.classList.toggle("dark", preferredTheme === "dark");
	}, []);
	const toggleTheme = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
		document.documentElement.classList.toggle("dark", nextTheme === "dark");
		window.localStorage.setItem("sarah_auto_theme", nextTheme);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background text-foreground",
		children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
			onClick: () => setMobileMenuOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("no-print fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300", mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", collapsed ? "lg:w-20" : "w-72"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-sidebar-border/80 bg-background/95 px-4 py-4 backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-center transition-all duration-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: collapsed && !mobileMenuOpen ? 38 : 42 })
							}), (!collapsed || mobileMenuOpen) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold uppercase tracking-[0.18em] text-foreground",
								children: "SARAH AUTO"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "ERP Auto-école"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "hidden h-9 w-9 rounded-xl text-sidebar-foreground hover:bg-sidebar/70 hover:text-foreground lg:flex",
							onClick: () => setCollapsed((value) => !value),
							children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Menu, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "h-9 w-9 rounded-xl text-sidebar-foreground hover:bg-sidebar/70 hover:text-foreground lg:hidden",
							onClick: () => setMobileMenuOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronLeft, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-1 overflow-y-auto px-2 py-4",
					children: navItems.map(({ to, label, icon: Icon, exact }) => {
						const active = exact ? pathname === to : pathname.startsWith(to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							className: cn("group flex items-center gap-3 rounded-2xl px-3 py-3 transition duration-300", active ? "bg-sidebar/80 text-foreground shadow-sm ring-1 ring-primary/30" : "text-sidebar-foreground hover:bg-sidebar/80 hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5 transition-colors duration-300", active ? "text-primary" : "text-slate-400 group-hover:text-primary") }), (!collapsed || mobileMenuOpen) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: label
							})]
						}, to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("border-t border-slate-800 p-4", collapsed && !mobileMenuOpen ? "hidden" : ""),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "w-full justify-start gap-3 text-slate-300 hover:bg-red-500/10 hover:text-red-300",
						onClick: () => {
							clearSession();
							toast.success("Déconnexion réussie");
							navigate({ to: "/login" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogOut, { className: "h-4 w-4" }), "Déconnexion"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 text-center text-[10px] text-slate-400/70",
						children: "v2.0"
					})]
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: cn("flex-1 transition-all duration-300", isAdmin && (collapsed ? "lg:pl-20" : "lg:pl-72")),
			children: [
				isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("no-print fixed inset-x-0 top-0 z-20 border-b border-sidebar-border bg-background/95 backdrop-blur-xl", collapsed ? "lg:left-20" : "lg:left-72"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "rounded-xl lg:hidden",
									onClick: () => setMobileMenuOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Menu, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden grid h-11 w-11 place-items-center rounded-2xl bg-card text-foreground sm:grid",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs",
									children: "Section"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-foreground sm:text-lg",
									children: activeSection
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "rounded-2xl text-muted-foreground hover:text-foreground",
								onClick: () => toast("Aucune nouvelle notification pour le moment."),
								"aria-label": "Notifications",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bell, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "rounded-2xl text-muted-foreground hover:text-foreground",
								onClick: toggleTheme,
								"aria-label": "Changer le thème",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sun, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Moon, { className: "h-5 w-5" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden border-t border-sidebar-border/50 px-4 py-2 text-[10px] text-muted-foreground sm:block sm:px-6 sm:text-xs lg:px-8",
						children: breadcrumbs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tableau de bord" }) : breadcrumbs.map((crumb, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: crumb.href,
								className: "font-medium text-primary hover:underline",
								children: crumb.label
							}), index < breadcrumbs.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "/"
							})]
						}, crumb.href))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("mx-auto w-full max-w-full px-4 pb-20 sm:px-6 lg:px-8 lg:pb-12 animate-fade-in-up bg-background text-foreground", isAdmin ? "pt-20 sm:pt-28" : "pt-0"),
					children
				}),
				isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "no-print fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-card py-2 lg:hidden",
					children: navItems.map(({ to, label, icon: Icon, exact }) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							className: cn("flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]", (exact ? pathname === to : pathname.startsWith(to)) ? "text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), label.split(" ")[0]]
						}, to);
					})
				})
			]
		})]
	});
}
const useStore = create((set, get) => ({
	eleves: [],
	formations: [],
	inscriptions: [],
	factures: [],
	paiements: [],
	examens: [],
	examen_sessions: [],
	examen_session_eleves: [],
	moniteurs: [],
	seances: [],
	planning_sessions: [],
	vehicules: [],
	depenses: [],
	profiles: [],
	users: [],
	audit: [],
	isLoading: false,
	fetchData: async () => {
		set({ isLoading: true });
		try {
			const [{ data: eleves }, { data: formations }, { data: inscriptions }, { data: factures }, { data: paiements }, { data: examens }, { data: examen_sessions }, { data: examen_session_eleves }, { data: moniteurs }, { data: seances }, { data: vehicules }, { data: depenses }, { data: profiles }, { data: audit }, { data: permis }, { data: inspecteurs }] = await Promise.all([
				supabase.from("eleves").select("*").order("created_at", { ascending: false }),
				supabase.from("formations").select("*").order("nom"),
				supabase.from("inscriptions").select("*"),
				supabase.from("factures").select("*"),
				supabase.from("paiements").select("*"),
				supabase.from("examens").select("*").order("date_examen", { ascending: false }),
				supabase.from("examen_sessions").select("*").order("date_examen", { ascending: false }),
				supabase.from("examen_session_eleves").select("*"),
				supabase.from("moniteurs").select("*").order("nom"),
				supabase.from("seances").select("*").order("date_seance", { ascending: false }),
				supabase.from("vehicules").select("*").order("immatriculation"),
				supabase.from("depenses").select("*").order("date_depense", { ascending: false }),
				supabase.from("profiles").select("*"),
				supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(100),
				supabase.from("permis").select("*"),
				supabase.from("inspecteurs").select("*")
			]);
			const mappedEleves = (eleves || []).map((e) => {
				const p = (permis || []).find((x) => x.id === e.permis_id);
				const insp = (inspecteurs || []).find((x) => x.id === e.inspecteur_id);
				return {
					...e,
					dossier_code: e.id.slice(0, 8).toUpperCase(),
					type_permis: p?.code || "B",
					code: e.id.slice(-4).toUpperCase(),
					inspecteur: insp ? `${insp.prenom} ${insp.nom}` : null,
					statut: e.statut || "prospect"
				};
			});
			const mappedFactures = (factures || []).map((f) => {
				const montant_paye = (paiements || []).filter((p) => p.facture_id === f.id).reduce((sum, p) => sum + p.montant, 0);
				let statut = "non_payee";
				if (montant_paye >= f.montant) statut = "payee";
				else if (montant_paye > 0) statut = "partielle";
				return {
					...f,
					montant_paye,
					statut
				};
			});
			const mappedDepenses = (depenses || []).map((d) => ({
				...d,
				date: d.date_depense || d.created_at || ""
			}));
			const mappedExamens = (examens || []).map((ex) => {
				const insp = (inspecteurs || []).find((x) => x.id === ex.inspecteur_id);
				const eleve = mappedEleves.find((e) => e.id === ex.eleve_id);
				return {
					...ex,
					type_permis: eleve?.type_permis || "B",
					inspecteur: insp ? `${insp.prenom} ${insp.nom}` : null
				};
			});
			const mappedSessions = (examen_sessions || []).map((s) => {
				const sessionEleves = (examen_session_eleves || []).filter((e) => e.session_id === s.id);
				const total = sessionEleves.length;
				const admis = sessionEleves.filter((e) => e.resultat === "admis").length;
				const echec = sessionEleves.filter((e) => e.resultat === "echec").length;
				return {
					...s,
					eleves_count: total,
					admis_count: admis,
					echec_count: echec,
					taux_reussite: total > 0 ? admis / total * 100 : 0
				};
			});
			const mappedPlanning = (seances || []).map((s) => {
				const eleve = mappedEleves.find((e) => e.id === s.eleve_id);
				return {
					...s,
					titre: s.titre || (eleve ? `Conduite: ${eleve.prenom} ${eleve.nom}` : "Séance de conduite"),
					date_heure: s.date_seance ? `${s.date_seance}T${s.heure_debut || "08:00:00"}` : "",
					duree_minutes: s.duree_minutes || 60,
					type: s.type || "Formation",
					lieu: s.lieu || null
				};
			});
			const users = (profiles || []).map((p) => ({
				id: p.id,
				email: p.email,
				name: p.name || "",
				role: p.role,
				created_at: p.created_at || ""
			}));
			set({
				eleves: mappedEleves,
				formations: formations || [],
				inscriptions: (inscriptions || []).map((ins) => ({
					...ins,
					dossier_code: ins.id.slice(0, 8).toUpperCase()
				})),
				factures: mappedFactures,
				paiements: paiements || [],
				examens: mappedExamens,
				examen_sessions: mappedSessions,
				examen_session_eleves: examen_session_eleves || [],
				moniteurs: moniteurs || [],
				seances: seances || [],
				planning_sessions: mappedPlanning,
				vehicules: vehicules || [],
				depenses: mappedDepenses,
				profiles: profiles || [],
				users,
				audit: audit || []
			});
		} finally {
			set({ isLoading: false });
		}
	},
	addEleve: async (e) => {
		const { data, error } = await supabase.from("eleves").insert(e).select().single();
		if (error) throw error;
		await get().fetchData();
		get().addAuditEntry("CREATION", "ELEVE", data.id, null, data);
	},
	updateEleve: async (id, e) => {
		const old = get().eleves.find((x) => x.id === id);
		const { data, error } = await supabase.from("eleves").update(e).eq("id", id).select().single();
		if (error) throw error;
		await get().fetchData();
		get().addAuditEntry("MODIFICATION", "ELEVE", id, old, data);
	},
	deleteEleve: async (id) => {
		const old = get().eleves.find((x) => x.id === id);
		const { error } = await supabase.from("eleves").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
		get().addAuditEntry("SUPPRESSION", "ELEVE", id, old, null);
	},
	addFormation: async (f) => {
		const { error } = await supabase.from("formations").insert(f);
		if (error) throw error;
		await get().fetchData();
	},
	updateFormation: async (id, f) => {
		const { error } = await supabase.from("formations").update(f).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteFormation: async (id) => {
		const { error } = await supabase.from("formations").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addInscription: async (i) => {
		const { data: inscription, error: insError } = await supabase.from("inscriptions").insert(i).select().single();
		if (insError) throw insError;
		const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
		const { error: facError } = await supabase.from("factures").insert({
			eleve_id: i.eleve_id,
			inscription_id: inscription.id,
			montant: i.tarif,
			numero: invoiceNumber,
			statut: "impayee"
		});
		if (facError) throw facError;
		await get().fetchData();
	},
	deleteInscription: async (id) => {
		const { error } = await supabase.from("inscriptions").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addPaiement: async (p) => {
		const { error } = await supabase.from("paiements").insert(p);
		if (error) throw error;
		await get().fetchData();
	},
	deletePaiement: async (id) => {
		const { error } = await supabase.from("paiements").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addExamen: async (e) => {
		const { error } = await supabase.from("examens").insert(e);
		if (error) throw error;
		await get().fetchData();
	},
	updateExamen: async (id, e) => {
		const { error } = await supabase.from("examens").update(e).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteExamen: async (id) => {
		const { error } = await supabase.from("examens").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addExamenSession: async (s) => {
		const user = await getCurrentUser();
		const { error } = await supabase.from("examen_sessions").insert({
			...s,
			created_by: user?.id
		});
		if (error) throw error;
		await get().fetchData();
	},
	updateExamenSession: async (id, s) => {
		const { error } = await supabase.from("examen_sessions").update(s).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteExamenSession: async (id) => {
		const { error } = await supabase.from("examen_sessions").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addElevesToSession: async (sessionId, eleveIds) => {
		const { eleves } = get();
		const payloads = eleveIds.map((eid) => {
			const e = eleves.find((x) => x.id === eid);
			return {
				session_id: sessionId,
				eleve_id: eid,
				nom_complet: e ? `${e.prenom} ${e.nom}` : "Élève inconnu",
				identifiant: e?.num_piece || e?.dossier_code || "N/A",
				telephone: e?.telephone || "N/A",
				categorie_permis: e?.type_permis || "B"
			};
		});
		const { error } = await supabase.from("examen_session_eleves").insert(payloads);
		if (error) throw error;
		await get().fetchData();
	},
	updateSessionEleve: async (id, data) => {
		const { error } = await supabase.from("examen_session_eleves").update(data).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	removeEleveFromSession: async (id) => {
		const { error } = await supabase.from("examen_session_eleves").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addMoniteur: async (m) => {
		const { error } = await supabase.from("moniteurs").insert(m);
		if (error) throw error;
		await get().fetchData();
	},
	updateMoniteur: async (id, m) => {
		const { error } = await supabase.from("moniteurs").update(m).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteMoniteur: async (id) => {
		const { error } = await supabase.from("moniteurs").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addPlanningSession: async (s) => {
		const { error } = await supabase.from("seances").insert(s);
		if (error) throw error;
		await get().fetchData();
	},
	updatePlanningSession: async (id, s) => {
		const { error } = await supabase.from("seances").update(s).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deletePlanningSession: async (id) => {
		const { error } = await supabase.from("seances").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addVehicule: async (v) => {
		const { error } = await supabase.from("vehicules").insert(v);
		if (error) throw error;
		await get().fetchData();
	},
	updateVehicule: async (id, v) => {
		const { error } = await supabase.from("vehicules").update(v).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteVehicule: async (id) => {
		const { error } = await supabase.from("vehicules").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addDepense: async (d) => {
		const user = await getCurrentUser();
		const { error } = await supabase.from("depenses").insert({
			...d,
			utilisateur_id: user?.id
		});
		if (error) throw error;
		await get().fetchData();
	},
	updateDepense: async (id, d) => {
		const { error } = await supabase.from("depenses").update(d).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteDepense: async (id) => {
		const { error } = await supabase.from("depenses").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addUser: async (user) => {
		if (!user.email || !user.password) throw new Error("Email and password are required to create a user.");
		const { error } = await supabase.auth.signUp({
			email: user.email,
			password: user.password,
			options: { data: {
				name: user.name,
				role: user.role
			} }
		});
		if (error) throw error;
		await get().fetchData();
	},
	updateUser: async (id, data) => {
		const { error } = await supabase.from("profiles").update(data).eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	deleteUser: async (id) => {
		const { error } = await supabase.from("profiles").delete().eq("id", id);
		if (error) throw error;
		await get().fetchData();
	},
	addAuditEntry: async (action, entity, entity_id, old_data, new_data) => {
		const user = await getCurrentUser();
		await supabase.from("audit_log").insert({
			action,
			entity,
			entity_id,
			old_data: old_data ? JSON.parse(JSON.stringify(old_data)) : null,
			new_data: new_data ? JSON.parse(JSON.stringify(new_data)) : null,
			user_id: user?.id
		});
	},
	getMontantPaye: (factureId) => {
		const f = get().factures.find((x) => x.id === factureId);
		return f ? f.montant_paye : 0;
	},
	getStatutFacture: (factureId) => {
		const f = get().factures.find((x) => x.id === factureId);
		return f ? f.statut : "non_payee";
	},
	getFactureReste: (factureId) => {
		const f = get().factures.find((x) => x.id === factureId);
		if (!f) return 0;
		return Math.max(0, f.montant - f.montant_paye);
	}
}));
const formatXOF = (n) => new Intl.NumberFormat("fr-FR", {
	style: "decimal",
	maximumFractionDigits: 0
}).format(n) + " FCFA";
const formatTel = (tel) => {
	const clean = tel.replace(/\D/g, "");
	if (!clean) return "";
	return "+225 " + (clean.match(/.{1,2}/g) ?? []).join(" ");
};
const labelModePaiement = (m) => ({
	especes: "Espèces",
	orange_money: "Orange Money",
	wave: "Wave",
	virement: "Virement bancaire"
})[m] || m;
const labelResultat = (r) => ({
	en_attente: "En attente",
	admis: "Admis",
	echec: "Échec"
})[r] || r;
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router2 = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 p-4 bg-muted rounded-lg text-left overflow-auto max-h-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono text-destructive font-bold",
						children: error.message
					}), error.stack && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 text-[10px] font-mono text-muted-foreground",
						children: error.stack
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router2.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
const Route$d = createRootRouteWithContext()({
	ssr: false,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SARAH AUTO — Gestion Auto-École" },
			{
				name: "description",
				content: "Plateforme de gestion d'auto-école : élèves, formations, factures, paiements et examens."
			},
			{
				property: "og:title",
				content: "SARAH AUTO"
			},
			{
				property: "og:description",
				content: "ERP/CRM pour la gestion d'une auto-école."
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjAwIDIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cG9seWdvbiBwb2ludHM9JzYyLjcsMTAgMTM3LjMsMTAgMTkwLDYyLjcgMTkwLDEzNy4zIDEzNy4zLDE5MCA2Mi43LDE5MCAxMCwxMzcuMyAxMCw2Mi43JyBmaWxsPSd3aGl0ZScgc3Ryb2tlPScjMDA0YWFkJyBzdHJva2Utd2lkdGg9JzcnIHN0cm9rZS1saW5lam9pbj0nbWl0ZXInLz48cG9seWdvbiBwb2ludHM9JzY2LjksMjAgMTMzLjEsMjAgMTgwLDY2LjkgMTgwLDEzMy4xIDEzMy4xLDE4MCA2Mi43LDE4MCAyMCwxMzMuMSAyMCw2Ni45JyBmaWxsPSdub25lJyBzdHJva2U9JyMwMDRhYWQnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWpvaW49J21pdGVyJy8+PHBhdGggaWQ9J2dwJyBkPSdNIDM4LDcwIEEgNjgsNjggMCAwLDEgMTYyLDcwJyBmaWxsPSdub25lJyBzdHJva2U9J25vbmUnLz48dGV4dCBmb250LWZhbWlseT0nc3lzdGVtLXVpLCBzYW5zLXNlcmlmJyBmb250LXdlaWdodD0nOTAwJyBmb250LXNpemU9JzIxJyBmaWxsPSd3aGl0ZScgc3Ryb2tlPScjMDA0YWFkJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjx0ZXh0UGF0aCBocmVmPScjZ3AnIHN0YXJ0T2Zmc2V0PSc1MCUnIHRleHQtYW5jaG9yPSdtaWRkbGUnPkdST1VQRTwvdGV4dFBhdGg+PC90ZXh0Pjxwb2x5Z29uIHBvaW50cz0nMTAwLDQyIDExMi45LDgxLjIgMTUyLjMsODIgMTIwLjksMTA1LjggMTMyLjMsMTQzLjUgMTAwLDEyMSA2Ny43LDE0My41IDc5LjEsMTA1LjggNDcuNyw4MiA4Ny4xLDgxLjInIGZpbGw9JyMwMDRhYWQnIHN0cm9rZT0nIzAwNGFhZCcgc3Ryb2tlLXdpZHRoPScxLjUnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz48ZyBmaWxsPSdub25lJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzQnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTAwLDkzKSBzY2FsZSgwLjkpJz48cGF0aCBkPSdNIDYsLTggQyA2LC04IDIsLTEzIC00LC0xMyBDIC0xMSwtMTMgLTE3LC04IC0xNywwIEMgLTE3LDggLTExLDEzIC00LDEzIEMgMiwxMyA3LDkgNywyIEwgNywwIEwgLTIsMCcvPjxwYXRoIGQ9J00gMTQsLTkgQyAxNCwtMTMgOSwtMTMgNiwtOSBDIDMsLTUgMTEsLTQgOCwyIEMgNSw4IC0xLDggLTQsNicvPjwvZz48dGV4dCB4PScxMDAnIHk9JzE2NycgZm9udC1mYW1pbHk9J3N5c3RlbS11aSwgc2Fucy1zZXJpZicgZm9udC13ZWlnaHQ9JzkwMCcgZm9udC1zaXplPScyNicgbGV0dGVyLXNwYWNpbmc9JzMnIGZpbGw9J3doaXRlJyBzdHJva2U9JyMwMDRhYWQnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz5TQVJBSDwvdGV4dD48L3N2Zz4="
			},
			{
				rel: "stylesheet",
				href: appCss
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient: queryClient2 } = Route$d.useRouteContext();
	const fetchData = useStore(useShallow((s) => s.fetchData));
	const [sessionId, setSessionId] = (0, import_react.useState)(null);
	const [sessionType, setSessionType] = (0, import_react.useState)(null);
	const [isAuthLoading, setIsAuthLoading] = (0, import_react.useState)(true);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const location = useLocation();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!mounted) return;
		const checkAuth = async () => {
			const session = await getSession();
			const isPublic = ["/login", "/signup"].includes(location.pathname);
			if (session) {
				setSessionId(session.user.id);
				setSessionType("admin");
				if (isPublic) navigate({ to: "/" });
			} else {
				const localId = localStorage.getItem("sarah_auto_session_id");
				const localType = localStorage.getItem("sarah_auto_session_type");
				if (localId && localType === "eleve") {
					setSessionId(localId);
					setSessionType("eleve");
					if (isPublic) navigate({ to: "/portal" });
				} else if (!isPublic) navigate({ to: "/login" });
			}
			setIsAuthLoading(false);
		};
		checkAuth();
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && session) {
				setSessionId(session.user.id);
				setSessionType("admin");
			} else if (event === "SIGNED_OUT") {
				setSessionId(null);
				setSessionType(null);
				navigate({ to: "/login" });
			}
		});
		return () => subscription.unsubscribe();
	}, [
		location.pathname,
		navigate,
		mounted
	]);
	(0, import_react.useEffect)(() => {
		if (sessionId && mounted) fetchData();
	}, [
		sessionId,
		fetchData,
		mounted
	]);
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background text-foreground",
		suppressHydrationWarning: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
			client: queryClient2,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootLayout, {
				sessionId,
				sessionType,
				children: isAuthLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-screen items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-right",
				closeButton: true,
				richColors: true
			})]
		})
	});
}
function RootLayout({ children, sessionId, sessionType }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		sessionId,
		sessionType,
		children
	});
}
const $$splitComponentImporter$c = () => import("./users-NbO9uGS9.mjs");
const Route$c = createFileRoute("/users")({
	head: () => ({ meta: [{ title: "Utilisateurs — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./signup-Dr2PF6pS.mjs");
const Route$b = createFileRoute("/signup")({ component: lazyRouteComponent($$splitComponentImporter$b, "component") });
const $$splitComponentImporter$a = () => import("./portal-B9uQIj0a.mjs");
const Route$a = createFileRoute("/portal")({
	head: () => ({ meta: [{ title: "Mon Espace — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./planning-DRQyToOg.mjs");
const Route$9 = createFileRoute("/planning")({
	head: () => ({ meta: [{ title: "Planning — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./paiements-C6s8Kesh.mjs");
const Route$8 = createFileRoute("/paiements")({
	head: () => ({ meta: [{ title: "Paiements — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./moniteurs-C75xKioz.mjs");
const Route$7 = createFileRoute("/moniteurs")({
	head: () => ({ meta: [{ title: "Moniteurs — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./login-DTRHSJEq.mjs");
const Route$6 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
const $$splitComponentImporter$5 = () => import("./formations-D3GfuG5T.mjs");
const Route$5 = createFileRoute("/formations")({
	head: () => ({ meta: [{ title: "Formations — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./factures-D9X34koV.mjs");
const Route$4 = createFileRoute("/factures")({
	head: () => ({ meta: [{ title: "Factures — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./examens-BWr4Nwop.mjs");
const Route$3 = createFileRoute("/examens")({
	head: () => ({ meta: [{ title: "Examens — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./eleves-DAZxKSMp.mjs");
const Route$2 = createFileRoute("/eleves")({
	head: () => ({ meta: [{ title: "Élèves — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./comptabilite-rTx77lki.mjs");
const Route$1 = createFileRoute("/comptabilite")({
	head: () => ({ meta: [{ title: "Comptabilité — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DkYzni34.mjs");
const Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Tableau de bord — SARAH AUTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsersRoute = Route$c.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => Route$d
});
const SignupRoute = Route$b.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$d
});
const PortalRoute = Route$a.update({
	id: "/portal",
	path: "/portal",
	getParentRoute: () => Route$d
});
const PlanningRoute = Route$9.update({
	id: "/planning",
	path: "/planning",
	getParentRoute: () => Route$d
});
const PaiementsRoute = Route$8.update({
	id: "/paiements",
	path: "/paiements",
	getParentRoute: () => Route$d
});
const MoniteursRoute = Route$7.update({
	id: "/moniteurs",
	path: "/moniteurs",
	getParentRoute: () => Route$d
});
const LoginRoute = Route$6.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$d
});
const FormationsRoute = Route$5.update({
	id: "/formations",
	path: "/formations",
	getParentRoute: () => Route$d
});
const FacturesRoute = Route$4.update({
	id: "/factures",
	path: "/factures",
	getParentRoute: () => Route$d
});
const ExamensRoute = Route$3.update({
	id: "/examens",
	path: "/examens",
	getParentRoute: () => Route$d
});
const ElevesRoute = Route$2.update({
	id: "/eleves",
	path: "/eleves",
	getParentRoute: () => Route$d
});
const ComptabiliteRoute = Route$1.update({
	id: "/comptabilite",
	path: "/comptabilite",
	getParentRoute: () => Route$d
});
const rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$d
	}),
	ComptabiliteRoute,
	ElevesRoute,
	ExamensRoute,
	FacturesRoute,
	FormationsRoute,
	LoginRoute,
	MoniteursRoute,
	PaiementsRoute,
	PlanningRoute,
	PortalRoute,
	SignupRoute,
	UsersRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const queryClient = new QueryClient();
const getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
	__proto__: null,
	getRouter
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { Button as B, Logo as L, getSessionId as a, formatTel as b, compressImage as c, clearSession as d, downloadCsv as e, formatXOF as f, getCurrentUser as g, signIn as h, cn as i, labelResultat as j, buttonVariants as k, labelModePaiement as l, supabase as m, router as r, signUp as s, useStore as u, validateStudentCredentials as v };
