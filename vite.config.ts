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
    ssr: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Crucial: Évite la création de chunks séparés pour le serveur
        inlineDynamicImports: true,
      },
    },
  },
  ssr: {
    // Inclut toutes les dépendances dans le bundle pour éviter les ERR_MODULE_NOT_FOUND
    noExternal: true,
  },
});
