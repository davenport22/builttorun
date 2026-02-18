import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from '@/components/error-boundary'
import { AuthProvider } from '@/providers/auth-provider'
import { QueryProvider } from '@/providers/query-provider'
import { App } from '@/app'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
)
