import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const response = await handler(request);
      return response;
    } catch (error: any) {
      console.error("SSR Handler Error:", error);
      
      // Return a more detailed error message if possible
      return new Response(JSON.stringify({
        error: "Internal Server Error",
        message: error?.message || String(error),
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
};
