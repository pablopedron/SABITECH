import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dentro de Docker (ver compose.yaml) los cambios se detectan por sondeo
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
})
