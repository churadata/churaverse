import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
  build: {
    sourcemap: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
  plugins: [
    react({
      exclude: '**/*.tsx' // HMR後にゲーム操作が効かなくなるため
    })
  ],
})
