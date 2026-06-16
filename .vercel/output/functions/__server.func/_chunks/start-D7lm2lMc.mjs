import "../_runtime.mjs";
import { r as renderErrorPage } from "../index.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import "../_libs/@tanstack/router-core+[...].mjs";
import { c as createMiddleware } from "./server-DqburJp7.mjs";
import * as fs from "node:fs";
require_react();
require_jsx_runtime();
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
function logToFile(msg) {
	try {
		fs.appendFileSync("server-debug.log", `${(/* @__PURE__ */ new Date()).toISOString()} ${msg}
`);
	} catch (e) {}
}
const errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		const errorMsg = `START MIDDLEWARE ERROR: ${error instanceof Error ? error.stack : String(error)}`;
		logToFile(errorMsg);
		console.error(errorMsg);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
const startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware] }));
//#endregion
export { startInstance };
