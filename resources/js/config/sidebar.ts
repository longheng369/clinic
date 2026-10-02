import {
  Calendar,
  FlaskConical,
  Folder,
  LayoutDashboard,
  ListChecks,
  Pill,
  Route,
  RulerDimensionLine,
  Settings,
  Syringe,
  Users,
} from 'lucide-react';
import type { ISidebarSection } from '@/interfaces/ISidebar';

export const sidebarSections: ISidebarSection[] = [
  {
    title: 'sidebar.menu',
    items: [
      { label: 'sidebar.dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'sidebar.patients', icon: Users, path: '/patients' },
      {
        label: 'sidebar.appointments',
        icon: Calendar,
        path: '/appointments',
      },
    ],
  },
  {
    title: 'sidebar.clinic',
    items: [
      { label: 'sidebar.medicines', icon: Pill, path: '/medicines' },
      { label: 'sidebar.vaccines', icon: Syringe, path: '/vaccines' },
    ],
  },
  {
    title: 'sidebar.setting',
    items: [
      {
        label: 'sidebar.settings',
        icon: Settings,
        children: [
          { label: 'sidebar.categories', icon: Folder, path: '/settings/categories' },
          { label: 'sidebar.units', icon: RulerDimensionLine, path: '/settings/units' },
          { label: 'sidebar.routes', icon: Route, path: '/settings/routes' },
          { label: 'sidebar.medicineInstructions', icon: ListChecks, path: '/settings/medicine-instructions' },
          { label: 'sidebar.diagnosticTests', icon: FlaskConical, path: '/settings/diagnostic-tests' },
        ],
      },
    ],
  },
];
