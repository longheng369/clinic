import {
  Calendar,
  ClipboardList,
  FlaskConical,
  Folder,
  LayoutDashboard,
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
    title: 'Menu',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Patients', icon: Users, path: '/patients' },
      {
        label: 'Appointments',
        icon: Calendar,
        path: '/appointments',
      },
    ],
  },
  {
    title: 'Clinic',
    items: [
      { label: 'Medicines', icon: Pill, path: '/medicines' },
      { label: 'Vaccines', icon: Syringe, path: '/vaccines' },
      {
        label: 'Para Clinic',
        icon: ClipboardList,
        path: '/para-clinic-requests',
      },
    ],
  },
  {
    title: 'Setting',
    items: [
      {
        label: 'Settings',
        icon: Settings,
        children: [
          { label: 'Category', icon: Folder, path: '/settings/categories' },
          { label: 'Units', icon: RulerDimensionLine, path: '/settings/units' },
          { label: 'Routes', icon: Route, path: '/settings/routes' },
          { label: 'Lap Test', icon: FlaskConical, path: '/settings/lap-tests' },
        ],
      },
    ],
  },
];
