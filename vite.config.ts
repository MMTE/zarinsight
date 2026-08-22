import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ADR-0009: API middleware in dev — one origin, no CORS, judges see /api on :5173.
async function apiMiddleware() {
  const { createApiApp } = await import('./server/index.mts')
  const app = createApiApp()
  return {
    name: 'zarinsight-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        app(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        app(req, res, next)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiMiddleware()],
  server: {
    proxy: {
      // ADR-0009/0011: eve agent child (built via `npm run agent:build`, started on :2319)
      '/eve': { target: process.env.EVE_URL ?? 'http://127.0.0.1:2319', changeOrigin: false },
    },
  },
})
