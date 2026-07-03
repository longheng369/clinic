import { SharedProps } from '@/types'

declare module '@inertiajs/react' {
    export function usePage<T extends Record<string, unknown> = Record<string, unknown>>(): {
        props: SharedProps & T
        url: string
        component: string
    }
}
