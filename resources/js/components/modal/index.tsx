import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import Modal from '@/components/modal/modal'
import Alert, { type AlertProps } from '@/components/modal/alert'

interface ModalConfig {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  preventClickAway?: boolean
  preventEscape?: boolean
  scrollable?: boolean
}

interface DialogConfig {
  id: string
  type: 'modal' | 'alert'
  title: string
  content: ReactNode
  open: boolean
  config?: ModalConfig
  alertProps?: Omit<AlertProps, 'onClose'>
}

interface ModalContextType {
  openModal: (dialog: Omit<DialogConfig, 'id' | 'open' | 'type'>) => string
  openAlert: (alert: Omit<AlertProps, 'onClose'>) => string
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}


export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dialogIdRef = useRef(0)
  const [dialogs, setDialogs] = useState<DialogConfig[]>([])

  const openModal = useCallback((dialog: Omit<DialogConfig, 'id' | 'open' | 'type'>) => {
    dialogIdRef.current += 1
    const id = `modal-${dialogIdRef.current}`
    setDialogs((prev) => [...prev, { ...dialog, id, type: 'modal', open: true }])
    return id
  }, [])

  const openAlert = useCallback((alertProps: Omit<AlertProps, 'onClose'>) => {
    dialogIdRef.current += 1
    const id = `alert-${dialogIdRef.current}`
    setDialogs((prev) => [
      ...prev,
      {
        id,
        type: 'alert',
        title: '',
        content: null,
        alertProps,
        open: true,
        config: { maxWidth: 'sm' },
      } as DialogConfig,
    ])
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
    <ModalContext.Provider value={{ openModal, openAlert, closeModal }}>
      {children}
      {dialogs.map((dialog) => {
          const content = dialog.type === 'alert' && dialog.alertProps
            ? <Alert {...dialog.alertProps} onClose={closeModal} />
            : dialog.content

          return (
            <Modal
              key={dialog.id}
              open={dialog.open}
              onClose={closeModal}
              title={dialog.title}
              maxWidth={dialog.config?.maxWidth || 'md'}
              preventClickAway={dialog.config?.preventClickAway}
              preventEscape={dialog.config?.preventEscape}
              scrollable={dialog.config?.scrollable}
            >
              {content}
            </Modal>
          )
        })}
    </ModalContext.Provider>
  )
}
