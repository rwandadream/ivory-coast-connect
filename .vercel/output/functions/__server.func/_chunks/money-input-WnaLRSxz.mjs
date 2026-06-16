import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as cn } from "./router-CQ4OfHlr.mjs";
import { t as Input } from "./input-CBnYHCr1.mjs";
//#region dist/server/assets/money-input-WnaLRSxz.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
const formatMoney = (value) => new Intl.NumberFormat("fr-FR", {
	style: "decimal",
	maximumFractionDigits: 0
}).format(value);
const parseMoney = (raw) => {
	const digits = raw.replace(/\D/g, "");
	if (!digits) return 0;
	return Number(digits);
};
const clampValue = (value, min, max) => {
	let result = value;
	if (typeof min === "number") result = Math.max(min, result);
	if (typeof max === "number") result = Math.min(max, result);
	return result;
};
const MoneyInput = import_react.forwardRef(({ className, value, onValueChange, min = 0, max, placeholder, disabled, required, ...props }, ref) => {
	const [displayValue, setDisplayValue] = import_react.useState(value > 0 ? formatMoney(value) : "");
	const [focused, setFocused] = import_react.useState(false);
	import_react.useEffect(() => {
		if (!focused) setDisplayValue(value > 0 ? formatMoney(value) : "");
	}, [value, focused]);
	const handleChange = (event) => {
		const raw = event.target.value;
		const clamped = clampValue(parseMoney(raw), min, max);
		setDisplayValue(clamped > 0 ? formatMoney(clamped) : raw.replace(/\D/g, ""));
		onValueChange(clamped);
	};
	const handleBlur = () => {
		setFocused(false);
		setDisplayValue(value > 0 ? formatMoney(clampValue(value, min, max)) : "");
	};
	const handleFocus = () => {
		setFocused(true);
		setDisplayValue(value > 0 ? String(value) : "");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			ref,
			type: "text",
			inputMode: "numeric",
			pattern: "[0-9]*",
			autoComplete: "off",
			value: displayValue,
			placeholder: placeholder ?? "0",
			onChange: handleChange,
			onBlur: handleBlur,
			onFocus: handleFocus,
			disabled,
			required,
			className: "pr-20",
			"aria-invalid": disabled ? void 0 : required && value <= 0,
			...props
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground",
			children: "FCFA"
		})]
	});
});
MoneyInput.displayName = "MoneyInput";
//#endregion
export { MoneyInput as t };
