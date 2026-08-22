import { route as ziggyRoute } from 'ziggy-js';
import type { SharedProps } from './';

declare global {
  var route: typeof ziggyRoute;
}

declare module '@inertiajs/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PageProps extends SharedProps {}
}
