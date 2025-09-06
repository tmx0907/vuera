import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" } // 절대 root, base, rollupOptions 등 넣지 않기
});
