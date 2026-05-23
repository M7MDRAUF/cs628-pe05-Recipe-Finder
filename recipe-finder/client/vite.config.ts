/**
 * vite.config.ts
 * -------------------------------------------------------
 * Vite configuration for the Recipe Finder React client.
 *
 * Key settings:
 *  - proxy: forwards /api/* to the Express server so that
 *    CORS is not needed during development (same-origin).
 *  - Path alias "@" maps to src/ for clean imports.
 * -------------------------------------------------------
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow "@/..." imports resolved from src/
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // Proxy /api/* requests to the Express back-end during development
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
