import { defineNitroConfig } from "nitro/config";
import { resolve } from "node:path";

export default defineNitroConfig({
  preset: "vercel",
  entry: resolve(__dirname, "dist/server/server.js"),
  publicAssets: [
    {
      dir: resolve(__dirname, "dist/client"),
      maxAge: 31536000,
    },
  ],
  compatibilityDate: "2024-06-16"
});
