import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import Toast, { type ToastVariant, type ToastData } from '@/components/toast/toast'

interface ToastOptions {
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toast: (message: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const idRef = useRef(0)
  const [toasts, setToasts] = useState<ToastData[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, options?: ToastOptions) => {
      idRef.current += 1
      const id = `toast-${idRef.current}`
      const data: ToastData = {
        id,
        message,
        description: options?.description,
        variant: options?.variant ?? 'info',
        duration: options?.duration ?? 4000,
      }
      setToasts((prev) => [...prev, data])
      return id
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
