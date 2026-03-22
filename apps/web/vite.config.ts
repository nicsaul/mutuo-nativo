import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, "../.."),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "convex/_generated": resolve(__dirname, "../../convex/_generated"),
    },
  },
  server: {
    port: 3006,
  },
});
