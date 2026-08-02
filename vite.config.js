import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

// Dev server proxies /api to the FastAPI backend -> no CORS setup needed
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The same aliases the reference components are written against, so their
  // imports (@components/…, @store/…) carry over unchanged.
  resolve: {
    alias: {
      "@components": src("components"),
      "@constant": src("constant"),
      "@services": src("services"),
      "@store": src("store"),
      "@assets": src("assets"),
      "@hook": src("hook"),
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
