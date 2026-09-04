import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import * as S from './Toast.styles'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
const AUTO_DISMISS_MS = 4000

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info'): void => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, message, variant }])
      window.setTimeout(() => dismissToast(id), AUTO_DISMISS_MS)
    },
    [dismissToast],
  )

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <S.Container role="status" aria-live="polite">
        {toasts.map((toast) => (
          <S.ToastItem key={toast.id} $variant={toast.variant}>
            <S.Message>{toast.message}</S.Message>
            <S.DismissButton
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              ×
            </S.DismissButton>
          </S.ToastItem>
        ))}
      </S.Container>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- useToast must live alongside ToastProvider/ToastContext
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
