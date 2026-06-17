import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // Sur Vercel, on peut logger la requête pour le debug
      console.log(`[SSR] Request: ${request.method} ${request.url}`);
      
      const response = await handler(request);
      return response;
    } catch (error: any) {
      console.error("CRITICAL SSR ERROR:", error);
      
      return new Response(JSON.stringify({
        status: 500,
        message: "Internal Server Error",
        details: error?.message || "Unknown error",
        path: request.url
      }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }
  },
};
