/** Vite build and dev-server setup: React and Tailwind plugins, the "@…" import aliases for the src folders, and the /api proxy to the local backend. */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": src("components"),
      "@constants": src("constants"),
      "@services": src("services"),
      "@store": src("store"),
      "@assets": src("assets"),
      "@hooks": src("hooks"),
      "@utils": src("utils"),
      "@routes": src("routes"),
      "@pages": src("pages"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
