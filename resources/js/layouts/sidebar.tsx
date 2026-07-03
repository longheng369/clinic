import React from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Pill,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  type LucideIcon,
} from 'lucide-react'

interface SidebarOption {
  label: string
  icon: LucideIcon
  path: string
  badge?: number
}

interface SidebarSection {
  title: string
  items: SidebarOption[]
}

const Sidebar = () => {
  const { url, props } = usePage()
  const user = props.auth?.user

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const sections: SidebarSection[] = [
    {
      title: 'Menu',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Appointments', icon: CalendarDays, path: '/appointments', badge: 5 },
        { label: 'Patients', icon: Users, path: '/patients' },
      ],
    },
    {
      title: 'Clinic',
      items: [
        { label: 'Doctors', icon: Stethoscope, path: '/doctors' },
        { label: 'Pharmacy', icon: Pill, path: '/pharmacy' },
        { label: 'Records', icon: ClipboardList, path: '/records' },
      ],
    },
    {
      title: 'Other',
      items: [
        { label: 'Settings', icon: Settings, path: '/settings' },
        { label: 'Help', icon: HelpCircle, path: '/help' },
      ],
    },
  ]

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <aside className='w-65 h-screen flex flex-col bg-sidebar-bg border-r border-slate-300'>
      {/* Logo */}
      <div className='flex items-center gap-3 px-6 py-6'>
        <div className='flex items-center justify-center size-9 rounded-lg bg-primary-500'>
          <Stethoscope size={20} className='text-white' />
        </div>
        <span className='text-lg font-semibold tracking-tight text-sidebar-text'>Clinic</span>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto px-4 py-5 space-y-6'>
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-sidebar-muted-light mb-2 px-3'>
              {section.title}
            </h3>
            <ul className='space-y-0.5'>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = item.path === url
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                        ${isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-sidebar-muted-light hover:text-sidebar-text hover:bg-sidebar-hover-light'
                        }`}
                    >
                      <Icon size={18} />
                      <span className='flex-1'>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`flex items-center justify-center size-5 rounded-full text-[11px] font-semibold
                            ${isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary-100 text-primary-700'
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className='border-t border-sidebar-border-light px-4 py-4'>
        <div className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover-light transition-colors'>
          <div className='size-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white'>
            {initials}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-sidebar-text truncate'>
              {user?.name ?? 'User'}
            </p>
            <p className='text-xs text-sidebar-muted-light truncate'>
              {user?.email ?? ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-sidebar-muted-light hover:text-danger hover:bg-danger/5 transition-colors w-full cursor-pointer'
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
