import { createStart, createMiddleware } from "@tanstack/react-start";
import * as fs from "node:fs";

import { renderErrorPage } from "./lib/error-page";

function logToFile(msg: string) {
  try {
    fs.appendFileSync("server-debug.log", `${new Date().toISOString()} ${msg}\n`);
  } catch (e) {
    // Ignore logging errors to avoid cascading failures
  }
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const errorMsg = `START MIDDLEWARE ERROR: ${error instanceof Error ? error.stack : String(error)}`;
    logToFile(errorMsg);
    console.error(errorMsg);

    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
