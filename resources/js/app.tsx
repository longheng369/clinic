import '../css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ModalProvider } from '@/components/modal'
import AuthenticatedLayout from '@/layouts/authenticatedLayout'
import GuestLayout from '@/layouts/guestLayout'

createInertiaApp({
    title: (title) => `${title} - Clinic`,
    resolve: async (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx')

        const path = `./pages/${name}.tsx`
        const mod = (await pages[path]()) as any

        if (!mod.default.layout) {
            mod.default.layout = name.startsWith('auth/')
                ? (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
                : (page: React.ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>
        }
        return mod
    },
    setup({ el, App, props }) {
        if (!el) return
        createRoot(el).render(
            <ModalProvider>
                <App {...props} />
            </ModalProvider>
        )
    },
})
