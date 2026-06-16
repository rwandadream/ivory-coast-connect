import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_lib } from "../_libs/recharts+[...].mjs";
import "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CDJ5ZpoW.mjs";
//#region dist/server/assets/DashboardCharts-DhU_pqxb.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_lib = require_lib();
function CustomTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-slate-700/90 bg-card/95 p-3 text-sm text-foreground shadow-elegant",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
				children: "Mois"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-semibold text-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					payload[0].name,
					": ",
					payload[0].value
				]
			})
		]
	});
}
function DashboardCharts({ enrollmentData }) {
	const [isMounted, setIsMounted] = import_react.useState(false);
	import_react.useEffect(() => {
		setIsMounted(true);
	}, []);
	const memoData = (0, import_react.useMemo)(() => enrollmentData, [enrollmentData]);
	if (!isMounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 w-full bg-slate-900/20 animate-pulse rounded-2xl" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden rounded-[2rem] shadow-elegant border border-slate-700/70 bg-card/90 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-sm font-bold uppercase tracking-[0.24em] text-foreground",
			children: "Évolution des inscriptions"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "h-56 p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_lib.AreaChart, {
					data: memoData,
					margin: {
						top: 10,
						right: 12,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "revenueGradient",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "5%",
								stopColor: "#fb923c",
								stopOpacity: .24
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "95%",
								stopColor: "#fb923c",
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.CartesianGrid, {
							strokeDasharray: "3 3",
							vertical: false,
							stroke: "rgba(148, 163, 184, 0.18)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.XAxis, {
							dataKey: "name",
							axisLine: false,
							tickLine: false,
							tick: {
								fontSize: 12,
								fill: "var(--color-muted-foreground)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.YAxis, {
							axisLine: false,
							tickLine: false,
							tick: {
								fontSize: 12,
								fill: "var(--color-muted-foreground)"
							},
							width: 30
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.Tooltip, {
							content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}),
							cursor: {
								stroke: "#fb923c",
								strokeWidth: 2,
								opacity: .25
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.Area, {
							type: "monotone",
							dataKey: "count",
							stroke: "#fb923c",
							strokeWidth: 3,
							fill: "url(#revenueGradient)",
							animationDuration: 900
						})
					]
				})
			})
		})]
	});
}
//#endregion
export { DashboardCharts as default };
