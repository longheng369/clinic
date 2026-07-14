import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-145 from-primary-100 via-primary-50 to-secondary-50 px-4 py-12">
            {/* Background decorative gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-primary-200)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-secondary-200)_0%,_transparent_50%)]" />

            <div className="relative w-full max-w-md rounded-3xl bg-white/95 shadow-xl shadow-primary-500/5 ring-1 ring-primary-100/50 backdrop-blur-sm px-8 py-8">
                {children}
            </div>
        </div>
    )
}
