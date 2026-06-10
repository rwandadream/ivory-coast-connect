import * as fs from "node:fs";
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

function logToFile(msg: string) {
  try {
    fs.appendFileSync("server-debug.log", `${new Date().toISOString()} ${msg}\n`);
  } catch (e) {}
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    logToFile("Importing server-entry...");
    serverEntryPromise = import("@tanstack/react-start/server-entry")
      .then((m) => {
        logToFile("server-entry imported successfully");
        return (m.default ?? m) as ServerEntry;
      })
      .catch((err) => {
        logToFile(`server-entry import FAILED: ${err.stack || err}`);
        throw err;
      });
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  const captured = consumeLastCapturedError();
  const error = captured ?? new Error(`h3 swallowed SSR error: ${body}`);
  logToFile(`H3 SWALLOWED ERROR: ${error instanceof Error ? error.stack : String(error)}`);

  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    logToFile(`FETCH REQUEST: ${request.url}`);
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      if (normalized.status >= 500) {
        logToFile(`Normalized Response Status: ${normalized.status}`);
      }
      return normalized;
    } catch (error) {
      const errorMsg = `SERVER FETCH ERROR: ${error instanceof Error ? error.stack : String(error)}`;
      logToFile(errorMsg);
      console.error(errorMsg);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
