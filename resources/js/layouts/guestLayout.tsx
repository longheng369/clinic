
import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 to-white px-4 py-12">
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 px-8 py-8">
                {children}
            </div>
        </div>
    )
}
