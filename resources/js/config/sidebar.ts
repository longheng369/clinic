import {
   Calendar,
   ClipboardList,
   Folder,
   HelpCircle,
   LayoutDashboard,
   Pill,
   RulerDimensionLine,
   Settings,
   Syringe,
   Users,
} from 'lucide-react'
import type { ISidebarSection } from '@/interfaces/ISidebar'

export const sidebarSections: ISidebarSection[] = [
   {
      title: 'Menu',
      items: [
         { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
         { label: 'Patients', icon: Users, path: '/patients' },
         { label: 'Appointments', icon: Calendar, path: '/appointments', badge: 3 },
      ],
   },
   {
      title: 'Clinic',
      items: [
         { label: 'Medicines', icon: Pill, path: '/medicines' },
         { label: 'Vaccines', icon: Syringe, path: '/vaccines' },
         { label: 'Paraclinic', icon: ClipboardList, path: '/paraclinic-requests' },
      ],
   },
   {
      title: 'Other',
      items: [
         {
            label: 'Settings',
            icon: Settings,
            children: [
               { label: 'Category', icon: Folder, path: '/settings/categories' },
               { label: 'Units', icon: RulerDimensionLine, path: '/settings/units' },
            ],
         },
         { label: 'Help', icon: HelpCircle, path: '/help' },
      ],
   },
]
