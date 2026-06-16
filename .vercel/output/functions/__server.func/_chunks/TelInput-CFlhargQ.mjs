import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as cn } from "./router-CQ4OfHlr.mjs";
import { t as Input } from "./input-CBnYHCr1.mjs";
//#region dist/server/assets/TelInput-CFlhargQ.js
var import_jsx_runtime = require_jsx_runtime();
function TelInput({ value, onChange, className, placeholder = "XX XX XX XX XX", id, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-stretch overflow-hidden rounded-md border border-input bg-background", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex items-center bg-muted px-3 text-sm font-medium text-muted-foreground",
			children: "+225"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			required,
			inputMode: "tel",
			value,
			onChange: (e) => onChange(e.target.value.replace(/[^\d ]/g, "").slice(0, 14)),
			placeholder,
			className: "border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
		})]
	});
}
//#endregion
export { TelInput as t };
