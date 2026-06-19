import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tanstackStart(),
    nitro({
      preset: "vercel",
      serveStatic: true,
      vercel: { entryFormat: "node" },
      compatibilityDate: "2024-06-16",
      routeRules: {
        "/_server/**": { cache: false },
      },
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    ssr: true,
    minify: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
  ssr: {
    noExternal:
      command === "build"
        ? true
        : ["@tanstack/react-start", "@tanstack/react-router", "@tanstack/react-query"],
  },
}));
