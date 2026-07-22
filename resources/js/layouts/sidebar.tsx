import React, { useState } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  Syringe,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Tags,
  Calendar,
  PanelLeft,
  PanelRight,
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
  const [collapsed, setCollapsed] = useState(false)

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const sections: SidebarSection[] = [
    {
      title: 'Menu',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Patients', icon: Users, path: '/patients' },
        { label: 'Appointments', icon: Calendar, path: '/appointments' },
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
    <aside
      className={`h-screen flex flex-col bg-white backdrop-blur-lg border-r border-gray-300 z-30 ${
        collapsed ? 'w-16' : 'w-75'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 ${collapsed ? 'justify-center px-0 py-6' : 'px-6 py-6'}`}>
        <div className='flex items-center justify-center size-9 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/20 shrink-0'>
          <Stethoscope size={20} className='text-white' />
        </div>
        {!collapsed && (
          <>
            <span className='text-lg font-semibold tracking-tight text-sidebar-text'>Clinic</span>
            <button
              onClick={() => setCollapsed(true)}
              className='ml-auto p-1.5 rounded-lg hover:bg-primary-50 text-sidebar-muted-light hover:text-primary-600 transition-colors duration-150 cursor-pointer'
              aria-label='Collapse sidebar'
            >
              <PanelLeft size={18} />
            </button>
          </>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className='absolute -right-3 top-6 p-1 rounded-full bg-white border border-primary-100 shadow-md text-primary-600 hover:text-primary-700 hover:bg-primary-50 cursor-pointer'
            aria-label='Expand sidebar'
          >
            <PanelRight size={14} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto px-4 py-5 space-y-6'>
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h3 className='text-xs font-semibold uppercase tracking-wider text-sidebar-muted-light mb-2 px-3'>
                {section.title}
              </h3>
            )}
            <ul className='space-y-0.5'>
              {section.items.map((item) => {
                const Icon = item.icon
                const isExpanded = expandedSections[item.label]

                if (item.children) {
                  if (collapsed) {
                    return (
                      <li key={item.label} className='flex justify-center'>
                        <button
                          onClick={() => { setCollapsed(false); toggleSection(item.label) }}
                          className='flex items-center justify-center size-10 rounded-xl text-sidebar-muted-light hover:text-primary-600 hover:bg-primary-50/50 cursor-pointer'
                          aria-label={item.label}
                        >
                          {Icon && <Icon size={20} />}
                        </button>
                      </li>
                    )
                  }
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => toggleSection(item.label)}
                        className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-sidebar-muted-light hover:text-primary-600 hover:bg-primary-50/50  cursor-pointer'
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
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                                    ${isChildActive
                                      ? 'bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/20 border-r-2 border-primary-600'
                                      : 'text-sidebar-muted-light hover:text-primary-600 hover:bg-primary-50/50'
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
                if (collapsed) {
                  return (
                    <li key={item.path} className='flex justify-center'>
                      <Link
                        href={item.path!}
                        className={`flex items-center justify-center size-10 rounded-xl  relative
                          ${isActive
                            ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/20 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-5 after:w-0.5 after:rounded-full after:bg-white'
                            : 'text-sidebar-muted-light hover:text-primary-600 hover:bg-primary-50/50'
                          }`}
                        aria-label={item.label}
                      >
                        {Icon && <Icon size={20} />}
                      </Link>
                    </li>
                  )
                }

                return (
                  <li key={item.path}>
                    <Link
                      href={item.path!}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        ${isActive
                          ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/20 border-r-2 border-primary-600'
                          : 'text-sidebar-muted-light hover:text-primary-600 hover:bg-primary-50/50'
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
      <div className='border-t border-primary-100/50 px-4 py-4'>
        {collapsed ? (
          <div className='flex flex-col items-center gap-2'>
            <button
              onClick={() => router.visit('/profile')}
              className='flex items-center justify-center size-10 rounded-xl text-sidebar-muted-light hover:text-primary-600 hover:bg-primary-50/50 cursor-pointer'
              aria-label='Profile'
            >
              <div className='size-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold'>
                {(user?.name ?? 'U').charAt(0).toUpperCase()}
              </div>
            </button>
            <button
              onClick={handleLogout}
              className='flex items-center justify-center size-10 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50  cursor-pointer'
              aria-label='Logout'
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => router.visit('/profile')} className='flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary-50/50  w-full cursor-pointer'>
              <div className='size-9 shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold'>
                {(user?.name ?? 'U').charAt(0).toUpperCase()}
              </div>
              <div className='flex flex-col min-w-0 text-left'>
                <p className='text-sm font-medium text-sidebar-text truncate'>
                  {user?.name ?? 'User'}
                </p>
                <p className='text-xs text-sidebar-muted-light truncate'>
                  {user?.email ?? ''}
                </p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className='flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm text-red-400 hover:text-red-600 hover:bg-red-50 w-full cursor-pointer'
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
