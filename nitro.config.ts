import { defineNitroConfig } from "nitro/config";
import { resolve } from "node:path";

export default defineNitroConfig({
  preset: "vercel",
  // Point to the ALREADY BUNDLED server from Vite
  entry: resolve(__dirname, "dist/server/server.js"),
  publicAssets: [
    {
      dir: resolve(__dirname, "dist/client"),
      maxAge: 31536000,
    },
  ],
  // We need to make sure Nitro picks up the relative assets used by dist/server/server.js
  routeRules: {
    "/assets/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
  },
  compatibilityDate: "2024-06-16"
});
