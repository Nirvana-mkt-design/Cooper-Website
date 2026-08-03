import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Serve the repo's /api functions during `vite dev`.
 *
 * In production Vercel turns api/*.ts into serverless functions; the dev server
 * knows nothing about them, so the white paper gate would 404 locally and the
 * page could not be worked on without deploying. This runs the same handler
 * module through Vite's SSR loader, so what a designer clicks locally is the
 * same code that ships, hot-reload included.
 */
function apiRoutes(): Plugin {
  const apiDir = fileURLToPath(new URL('../api/', import.meta.url))
  return {
    name: 'cooper-api-routes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        if (!path.startsWith('/api/')) return next()
        const name = path.slice('/api/'.length)
        // Only plain route names, and never the underscore-prefixed content
        // modules those routes import.
        if (!/^[a-z0-9-]+$/.test(name)) return next()
        try {
          const mod = await server.ssrLoadModule(`${apiDir}${name}.ts`)
          await mod.default(req, res)
        } catch (err) {
          server.config.logger.error(`[api] ${path} failed: ${String(err)}`)
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiRoutes()],
})
