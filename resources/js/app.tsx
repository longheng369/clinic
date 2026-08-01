import '../css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import type { ComponentType, ReactNode } from 'react'
import { ModalProvider } from '@/components/modal'
import { ToastProvider } from '@/components/toast'
import AuthenticatedLayout from '@/layouts/authenticatedLayout'
import GuestLayout from '@/layouts/guestLayout'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageComponent = ComponentType<any> & {
    layout?: (page: ReactNode) => ReactNode
}

createInertiaApp({
    title: (title) => `${title} - Clinic`,
    resolve: async (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx') as Record<
            string,
            () => Promise<{ default: PageComponent }>
        >

        const path = `./pages/${name}.tsx`
        const mod = await pages[path]()

        if (!mod.default.layout) {
            mod.default.layout = name.startsWith('auth/')
                ? (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
                : (page: React.ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return mod as any
    },
    setup({ el, App, props }) {
        if (!el) return
        createRoot(el).render(
            <ToastProvider>
                <ModalProvider>
                    <App {...props} />
                </ModalProvider>
            </ToastProvider>
        )
    },
})
