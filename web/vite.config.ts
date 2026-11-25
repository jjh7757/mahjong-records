import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 서버가 /records/ 아래에서 내보낸다. 개발 때는 /records/api 를 로컬 uvicorn(8000)으로 넘긴다.
export default defineConfig({
  base: '/records/',
  plugins: [react()],
  server: {
    proxy: {
      '/records/api': 'http://localhost:8000',
      '/records/healthz': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
