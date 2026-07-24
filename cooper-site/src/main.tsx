import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages (scripts/prerender.cjs) ship their HTML in #root and stamp
// data-prerendered with the route they were rendered for. Hydrate only when it
// matches the current URL — the SPA fallback serves index.html (home markup)
// for client-only routes like /careers/:id, where hydrating would mismatch.
const prerendered = root.dataset.prerendered
const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

if (prerendered && normalize(prerendered) === normalize(window.location.pathname)) {
  hydrateRoot(root, app)
} else {
  // createRoot().render() replaces any stale prerendered markup on commit.
  createRoot(root).render(app)
}
