import { route as ziggyRoute } from 'ziggy-js'
import type { SharedProps } from './'

declare global {
    var route: typeof ziggyRoute
}

declare module '@inertiajs/react' {
    interface PageProps extends SharedProps {}
}
