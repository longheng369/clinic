import { useState, useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  fullScreen?: boolean
  preventClickAway?: boolean
  preventEscape?: boolean
  scrollable?: boolean
}

const maxWidthClasses: Record<string, string> = {
   sm: 'max-w-sm',
   md: 'max-w-md',
   lg: 'max-w-lg',
   xl: 'max-w-xl',
   '2xl': 'max-w-2xl',
   '3xl': 'max-w-3xl',
   '4xl': 'max-w-4xl',
   '5xl': 'max-w-5xl'
}

const Modal = ({
   open,
   onClose,
   title,
   children,
   maxWidth = 'md',
   fullScreen = false,
   preventClickAway = false,
   preventEscape = false,
   scrollable = false,
}: ModalProps) => {
   const [visible, setVisible] = useState(false)
   const [mounted, setMounted] = useState(false)
   const panelRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (open) {
         setMounted(true)
         document.body.style.overflow = 'hidden'
         const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true))
         })
         return () => cancelAnimationFrame(raf)
      } else {
         document.body.style.overflow = ''
         setVisible(false)
         const panel = panelRef.current
         if (panel) {
            const handleTransitionEnd = (e: TransitionEvent) => {
               if (e.target === panel && e.propertyName === 'opacity') {
                  panel.removeEventListener('transitionend', handleTransitionEnd)
                  setMounted(false)
               }
            }
            panel.addEventListener('transitionend', handleTransitionEnd)
            return () => panel.removeEventListener('transitionend', handleTransitionEnd)
         }
      }
   }, [open])

   useEffect(() => {
      return () => {
         document.body.style.overflow = ''
      }
   }, [])

   useEffect(() => {
      if (preventEscape) return
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && open) onClose()
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
   }, [open, onClose, preventEscape])

   if (!mounted) return null

   if (fullScreen) {
      return (
         <div className="fixed inset-0 z-50">
            <div
               className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200 ${
                  visible ? 'opacity-100 ease-out' : 'opacity-0 ease-in'
               }`}
               onClick={preventClickAway ? undefined : onClose}
            />
            <div
               ref={panelRef}
               className={`relative z-10 flex flex-col h-screen w-screen rounded-none bg-white/98 backdrop-blur-sm shadow-xl transition-all duration-200 ${
                  visible
                     ? 'animate-modal-scale-in'
                     : 'scale-95 opacity-0 ease-in'
               }`}
            >
               <div className="flex items-center justify-between px-6 py-4 border-b border-primary-100/50 shrink-0">
                  <h2 className="text-lg font-bold truncate">{title}</h2>
                  <button
                     onClick={onClose}
                     className="rounded p-1 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all duration-150"
                     aria-label="Close"
                  >
                     <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
               </div>
               {children}
            </div>
         </div>
      )
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200 ${
               visible ? 'opacity-100 ease-out' : 'opacity-0 ease-in'
            }`}
            onClick={preventClickAway ? undefined : onClose}
         />
         <div
            ref={panelRef}
            className={`relative z-10 w-full rounded-3xl bg-white shadow-2xl shadow-primary-500/5 transition-all duration-200 ${
               visible
                  ? 'animate-modal-scale-in'
                  : 'scale-95 opacity-0 ease-in'
            } ${maxWidthClasses[maxWidth]}`}
         >
            <div className="flex items-center justify-between p-4 border-b border-primary-100/50">
               <h2 className="text-lg font-bold truncate">{title}</h2>
               <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all duration-150"
                  aria-label="Close"
               >
                  <svg
                     className="h-5 w-5"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     strokeWidth={2}
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
            {scrollable ? (
               <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
                  {children}
               </div>
            ) : (
               children
            )}
         </div>
      </div>
   )
}

export default Modal
