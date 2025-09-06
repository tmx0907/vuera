import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚠️ root, build.rollupOptions.input 같은 커스텀은 일단 없애요.
export default defineConfig({
  plugins: [react()],
  publicDir: "public",   // 정적 파일 폴더
  build: { outDir: "dist" }  // 빌드 출력 폴더
});

