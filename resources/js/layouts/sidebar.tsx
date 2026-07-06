import React, { useState } from 'react'
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
  ChevronDown,
  ChevronRight,
  Tags,
  type LucideIcon,
} from 'lucide-react'

interface SidebarOption {
  label: string
  icon?: LucideIcon
  path?: string
  badge?: number
  children?: SidebarOption[]
}

interface SidebarSection {
  title: string
  items: SidebarOption[]
}

const Sidebar = () => {
  const { url, props } = usePage()
  const user = props.auth?.user
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Settings: true,
  })

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const sections: SidebarSection[] = [
    {
      title: 'Menu',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Patients', icon: Users, path: '/patients' },
      ],
    },
    {
      title: 'Clinic',
      items: [
        { label: 'Medicines', icon: Pill, path: '/medicines' },
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
            { label: 'Category', icon: Tags, path: '/settings/categories' },
            { label: 'Units', icon: Tags, path: '/settings/units' },
          ],
        },
        { label: 'Help', icon: HelpCircle, path: '/help' },
      ],
    },
  ]

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <aside className='w-75 h-screen flex flex-col bg-sidebar-bg border-r border-slate-300'>
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
                const isExpanded = expandedSections[item.label]

                if (item.children) {
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => toggleSection(item.label)}
                        className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-sidebar-muted-light hover:text-sidebar-text hover:bg-sidebar-hover-light transition-colors duration-150 cursor-pointer'
                      >
                        {Icon && <Icon size={18} />}
                        <span className='flex-1 text-left'>{item.label}</span>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {isExpanded && (
                        <ul className='ml-6 mt-0.5 space-y-0.5'>
                          {item.children.map((child) => {
                            const isChildActive = child.path === url
                            return (
                              <li key={child.path}>
                                <Link
                                  href={child.path!}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                                    ${isChildActive
                                      ? 'bg-primary-100 text-primary-700'
                                      : 'text-sidebar-muted-light hover:text-sidebar-text hover:bg-sidebar-hover-light'
                                    }`}
                                >
                                  <span className='flex-1'>{child.label}</span>
                                  {child.badge && (
                                    <span
                                      className={`flex items-center justify-center size-5 rounded-full text-[11px] font-semibold
                                        ${isChildActive
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-primary-100 text-primary-700'
                                        }`}
                                    >
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                }

                const isActive = item.path === url
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path!}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                        ${isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-sidebar-muted-light hover:text-sidebar-text hover:bg-sidebar-hover-light'
                        }`}
                    >
                      {Icon && <Icon size={18} />}
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
      <div className='border-t border-slate-300 px-4 py-4'>
        <button onClick={() => router.visit('/profile')} className='flex flex-col items-start gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors w-full cursor-pointer'>
            <p className='text-sm font-medium truncate'>
                {user?.name ?? 'User'}
            </p>
            <p className='text-xs truncate'>
                {user?.email ?? ''}
            </p>
        </button>
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-danger/5 transition-colors w-full cursor-pointer'
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
