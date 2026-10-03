import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppProviders from './components/AppProviders'
import AppRoutes from './router.tsx'
import { registerServiceWorker } from './serviceWorker'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </StrictMode>,
)

registerServiceWorker()
