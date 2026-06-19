import { defineNitroConfig } from "nitro/config";
import { resolve } from "node:path";

export default defineNitroConfig({
  preset: "vercel",
  serveStatic: true,
  vercel: {
    entryFormat: "node",
  },

  publicAssets: [
    {
      dir: resolve(__dirname, "dist/client"),
      maxAge: 31536000,
    },
  ],

  routeRules: {
    "/_server/**": { cache: false },
  },

  compatibilityDate: "2024-06-16",
});
