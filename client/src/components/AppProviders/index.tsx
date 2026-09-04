import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { theme } from '../../theme'
import { AuthProvider } from '../../hooks/useAuth'
import ErrorBoundary from '../ErrorBoundary'
import { ToastProvider } from '../Toast'

interface AppProvidersProps {
  children: ReactNode
}

const queryClient = new QueryClient()

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <ToastProvider>{children}</ToastProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default AppProviders
