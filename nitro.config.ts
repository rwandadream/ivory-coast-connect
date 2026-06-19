import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "vercel",
  serveStatic: true,
  vercel: {
    entryFormat: "node",
  },

  routeRules: {
    "/_server/**": { cache: false },
  },

  compatibilityDate: "2024-06-16",
});
