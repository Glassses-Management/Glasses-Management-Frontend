import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorOverlay from '@/components/dev/ErrorOverlay'
import './index.css'

// The overlay lives in its own root so it survives the main app unmounting
// entirely (which is exactly what happens when an uncaught error blanks the page).
// It only renders in development builds.
const overlayContainer = document.createElement('div')
document.body.appendChild(overlayContainer)
if (import.meta.env.DEV) {
  createRoot(overlayContainer).render(<ErrorOverlay />)
}

// BrowserRouter must wrap App so any component inside can use routing (Link, useNavigate, etc.)
const root = createRoot(document.getElementById('root'), {
  onUncaughtError(error) {
    window.__errorReport?.(error?.stack || error?.message || String(error))
  },
  onCaughtError(error) {
    window.__errorReport?.(error?.stack || error?.message || String(error))
  },
})
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)