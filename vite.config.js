import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',              // 자산 경로 깨짐 방지
  build: {
    outDir: 'dist'        // Vercel은 dist를 Output Directory로 사용
  }
})
