globalThis.__nitro_main__ = import.meta.url;
import * as fs from "node:fs";
//#region dist/server/server.js
let lastCapturedError;
const TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
function logToFile(msg) {
	try {
		fs.appendFileSync("server-debug.log", `${(/* @__PURE__ */ new Date()).toISOString()} ${msg}
`);
	} catch (e) {}
}
let serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) {
		logToFile("Importing server-entry...");
		serverEntryPromise = import("./_chunks/server-DqburJp7.mjs").then((n) => n.s).then((m) => {
			logToFile("server-entry imported successfully");
			return m.default ?? m;
		}).catch((err) => {
			logToFile(`server-entry import FAILED: ${err.stack || err}`);
			throw err;
		});
	}
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!body.includes("\"unhandled\":true") || !body.includes("\"message\":\"HTTPError\"")) return response;
	const error = consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`);
	logToFile(`H3 SWALLOWED ERROR: ${error instanceof Error ? error.stack : String(error)}`);
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
const server = { async fetch(request, env, ctx) {
	logToFile(`FETCH REQUEST: ${request.url}`);
	try {
		const normalized = await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
		if (normalized.status >= 500) logToFile(`Normalized Response Status: ${normalized.status}`);
		return normalized;
	} catch (error) {
		const errorMsg = `SERVER FETCH ERROR: ${error instanceof Error ? error.stack : String(error)}`;
		logToFile(errorMsg);
		console.error(errorMsg);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server as default, renderErrorPage as r };
