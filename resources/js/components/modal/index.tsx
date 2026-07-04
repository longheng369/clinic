import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import Modal from '@/components/modal/modal'

interface ModalConfig {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  preventClickAway?: boolean
  preventEscape?: boolean
}

interface DialogConfig {
  id: string
  title: string
  content: ReactNode
  open: boolean
  config?: ModalConfig
}

interface ModalContextType {
  openModal: (dialog: Omit<DialogConfig, 'id' | 'open'>) => string
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dialogIdRef = useRef(0)
  const [dialogs, setDialogs] = useState<DialogConfig[]>([])

  const openModal = useCallback((dialog: Omit<DialogConfig, 'id' | 'open'>) => {
    dialogIdRef.current += 1
    const id = `modal-${dialogIdRef.current}`
    setDialogs((prev) => [...prev, { id, ...dialog, open: true }])
    return id
  }, [])

  const closeModal = useCallback(() => {
    setDialogs((prev) => {
      if (prev.length === 0) return prev
      const lastIndex = prev.length - 1
      const target = prev[lastIndex]
      if (!target.open) return prev

      const updated = prev.map((d, i) =>
        i === lastIndex ? { ...d, open: false } : d,
      )

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setDialogs((current) => {
          if (
            current.length > 0 &&
            current[current.length - 1].id === target.id
          ) {
            return current.slice(0, -1)
          }
          return current
        })
      }, 250)

      return updated
    })
  }, [])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {dialogs.map((dialog) => {
        const maxW = dialog.config?.maxWidth || 'md'
        const handleBackdropClick = () => {
          if (!dialog.config?.preventClickAway) closeModal()
        }

        return (
          <Modal
            key={dialog.id}
            open={dialog.open}
            onClose={closeModal}
            title={dialog.title}
          >
            {dialog.content}
          </Modal>
        )
      })}
    </ModalContext.Provider>
  )
}
