import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// L'application est servie à la racine par server.js ; en développement,
// les appels /api sont redirigés vers le serveur Node local.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "dist", emptyOutDir: true },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
      "/carte": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});
