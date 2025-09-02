// vite.config.js (루트)
import react from '@vitejs/plugin-react'

export default {
  // index.html이 있는 폴더
  root: 'public',
  plugins: [react()],
  build: {
    // 빌드 산출물 폴더
    outDir: '../dist',
    emptyOutDir: true
  }
}
