import '@/i18n';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import type { ComponentType, ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/km';
import { ModalProvider } from '@/components/modal';
import { ToastProvider } from '@/components/toast';
import AuthenticatedLayout from '@/layouts/authenticatedLayout';
import GuestLayout from '@/layouts/guestLayout';
import theme from '@/theme';

type PageComponent = ComponentType<any> & {
  layout?: (page: ReactNode) => ReactNode;
};

const Providers = ({
  App,
  props,
}: {
  App: ComponentType<any>;
  props: any;
}) => {
  const { i18n } = useTranslation();
  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <ModalProvider>
            <App {...props} />
          </ModalProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ToastProvider>
  );
};

createInertiaApp({
  title: (title) => `${title} - Clinic`,
  resolve: async (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx') as Record<
      string,
      () => Promise<{ default: PageComponent }>
    >;

    const path = `./pages/${name}.tsx`;
    const mod = await pages[path]();

    if (!mod.default.layout) {
      mod.default.layout = name.startsWith('auth/')
        ? (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
        : (page: React.ReactNode) => (
          <AuthenticatedLayout>{page}</AuthenticatedLayout>
        );
    }

    return mod as any;
  },
  setup({ el, App, props }) {
    if (!el) return;
    createRoot(el).render(
      <Providers App={App as ComponentType<any>} props={props} />,
    );
  },
});
