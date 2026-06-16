import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      return await handler(request);
    } catch (error) {
      console.error("SSR Handler Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
