import { defineNitroConfig } from "nitro/config";
import { resolve } from "node:path";

export default defineNitroConfig({
  preset: "vercel",
  
  publicAssets: [
    {
      dir: resolve(__dirname, "dist/client"),
      maxAge: 31536000,
    },
  ],

  // Configuration pour éviter les problèmes de mise en cache sur Vercel
  routeRules: {
    "/_server/**": { cache: false },
  },

  compatibilityDate: "2024-06-16"
});
