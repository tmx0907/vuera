import react from '@vitejs/plugin-react'

export default {
  root: 'public',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
}
