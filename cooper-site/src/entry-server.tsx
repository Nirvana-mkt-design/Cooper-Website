/*
 * SSR entry used only at build time by scripts/prerender.cjs (via
 * `vite build --ssr`). Renders a route to static HTML so prerendered pages
 * paint before the SPA bundle loads; main.tsx hydrates the markup on the
 * client. react-dom/static's prerender waits for Suspense/lazy content, so
 * the lazy routes resolve before the HTML is emitted.
 */
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App.tsx'

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
