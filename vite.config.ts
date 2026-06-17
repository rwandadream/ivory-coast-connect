import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    // TanStack Start a besoin d'un build SSR propre
    ssr: true,
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false, // Accélère le build et réduit les logs
    rollupOptions: {
      onwarn(warning, warn) {
        // Supprime les warnings d'imports inutilisés qui polluent la console
        if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
        warn(warning);
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
