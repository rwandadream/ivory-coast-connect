import "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_lib } from "../_libs/recharts+[...].mjs";
import "../_libs/sonner.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { f as formatXOF } from "./router-CQ4OfHlr.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CDJ5ZpoW.mjs";
//#region dist/server/assets/FinanceChart-CWAEVMKl.js
var import_jsx_runtime = require_jsx_runtime();
var import_lib = require_lib();
var import_lucide_react = require_lucide_react();
require_react();
function FinanceChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex items-center justify-between pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-lg font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.TrendingUp, { className: "h-5 w-5 text-primary" }), " Finances"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: "Performance et état des paiements"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.BarChart3, { className: "h-5 w-5 text-muted-foreground opacity-50" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[280px] w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_lib.BarChart, {
					data,
					margin: {
						top: 10,
						right: 10,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.CartesianGrid, {
							strokeDasharray: "3 3",
							vertical: false,
							stroke: "#e5e7eb"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.XAxis, {
							dataKey: "name",
							axisLine: false,
							tickLine: false,
							tick: {
								fontSize: 11,
								fill: "#6b7280"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.YAxis, {
							axisLine: false,
							tickLine: false,
							tick: {
								fontSize: 11,
								fill: "#6b7280"
							},
							tickFormatter: (value) => `${value / 1e3}k`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.Tooltip, {
							cursor: { fill: "rgba(59, 130, 246, 0.05)" },
							content: ({ active, payload }) => {
								if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border bg-background/95 p-3 shadow-elegant",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: payload[0].payload.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-base font-semibold text-foreground",
										children: formatXOF(payload[0].value)
									})]
								});
								return null;
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.Bar, {
							dataKey: "value",
							radius: [
								12,
								12,
								0,
								0
							],
							barSize: 44,
							animationDuration: 1500,
							animationBegin: 200,
							children: data.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lib.Cell, { fill: entry.color }, `cell-${index}`))
						})
					]
				})
			})
		}) })]
	});
}
//#endregion
export { FinanceChart as default };
