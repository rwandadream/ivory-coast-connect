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
    reportCompressedSize: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
        warn(warning);
      },
    },
  },
  ssr: {
    // Force l'inclusion de toutes les dépendances dans le bundle serveur
    // pour éviter les erreurs "Module Not Found" sur Vercel
    noExternal: true,
  },
  server: {
    host: "::",
    port: 8080,
  },
});
