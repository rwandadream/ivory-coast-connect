import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tanstackStart(),
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
        format: 'esm',
      },
    },
  },
  ssr: {
    noExternal: command === 'build' ? true : ['@tanstack/react-start', '@tanstack/react-router', '@tanstack/react-query'],
  },
}));
