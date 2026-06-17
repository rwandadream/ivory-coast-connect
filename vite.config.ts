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
    // On ne met en noExternal que ce qui est nécessaire pour TanStack Start
    noExternal: ['@tanstack/react-start', '@tanstack/react-router', '@tanstack/react-query'],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/server',
        'lucide-react',
      ],
    },
  },
});
