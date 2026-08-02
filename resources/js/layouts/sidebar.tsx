import React, { useState } from 'react'
import { Link as InertiaLink, usePage, router } from '@inertiajs/react'
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
import {
   Avatar,
   Box,
   Collapse,
   IconButton,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Tooltip,
   Typography,
} from '@mui/material'

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

const SidebarLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof InertiaLink>>(
   ({ children, ...props }, ref) => (
      <InertiaLink {...props} ref={ref}>
         {children}
      </InertiaLink>
   )
)
SidebarLink.displayName = 'SidebarLink'

const colors = {
   text: '#1e293b',
   muted: '#64748b',
   hover: '#f1f5f9',
   border: '#cbd5e1',
   primary50: '#f4f9f4',
   primary100: '#e3f0e3',
   primary500: '#5a8f5a',
   primary600: '#4a7a4a',
   primary700: '#3d633d',
}

const activeGradient = `linear-gradient(to bottom right, ${colors.primary500}, ${colors.primary700})`

const activeItemSx = {
   color: '#ffffff',
   backgroundImage: activeGradient,
   boxShadow: '0 4px 6px -1px rgba(90, 143, 90, 0.2)',
   borderRight: `2px solid ${colors.primary600}`,
   '&:hover': {
      color: '#ffffff',
      backgroundImage: activeGradient,
   },
}

const inactiveItemSx = {
   color: colors.muted,
   '&:hover': {
      color: colors.primary600,
      bgcolor: colors.primary50,
   },
}

const Sidebar = () => {
   const { url, props: pageProps } = usePage()
   const user = pageProps.auth?.user

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

   const renderBadge = (badge?: number, isActive?: boolean) =>
      badge ? (
         <Box
            component="span"
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               width: 20,
               height: 20,
               borderRadius: '50%',
               fontSize: 11,
               fontWeight: 600,
               bgcolor: isActive ? colors.primary600 : colors.primary100,
               color: isActive ? '#ffffff' : colors.primary700,
            }}
         >
            {badge}
         </Box>
      ) : null

   return (
      <Box
         component="aside"
         sx={{
            position: 'relative',
            height: '100vh',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#ffffff',
            borderRight: `1px solid ${colors.border}`,
            zIndex: 30,
            width: collapsed ? 64 : 300,
            transition: 'width 200ms ease',
         }}
      >
         {/* Logo */}
         <Box
            sx={{
               display: 'flex',
               alignItems: 'center',
               gap: 1.5,
               px: collapsed ? 0 : 3,
               py: 2.5,
               justifyContent: collapsed ? 'center' : 'flex-start',
            }}
         >
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  borderRadius: 1,
                  backgroundImage: `linear-gradient(to bottom right, ${colors.primary500}, ${colors.primary700})`,
                  boxShadow: '0 4px 6px -1px rgba(90, 143, 90, 0.2)',
                  color: '#ffffff',
               }}
            >
               <Stethoscope size={20} />
            </Box>
            {!collapsed && (
               <>
                  <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.025em', color: colors.text }}>
                     Clinic
                  </Typography>
                  <IconButton
                     onClick={() => setCollapsed(true)}
                     size="small"
                     aria-label="Collapse sidebar"
                     sx={{
                        ml: 'auto',
                        p: 1,
                        borderRadius: 1,
                        color: colors.muted,
                        '&:hover': { bgcolor: colors.primary50, color: colors.primary600 },
                     }}
                  >
                     <PanelLeft size={18} />
                  </IconButton>
               </>
            )}
            {collapsed && (
               <IconButton
                  onClick={() => setCollapsed(false)}
                  size="small"
                  aria-label="Expand sidebar"
                  sx={{
                     position: 'absolute',
                     right: -12,
                     top: 24,
                     p: 0.75,
                     bgcolor: '#ffffff',
                     border: `1px solid ${colors.primary100}`,
                     boxShadow: 2,
                     color: colors.primary600,
                     '&:hover': { bgcolor: colors.primary50 },
                  }}
               >
                  <PanelRight size={14} />
               </IconButton>
            )}
         </Box>

         {/* Navigation */}
         <Box component="nav" sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2.5 }}>
            {sections.map((section) => (
               <Box key={section.title} sx={{ mb: 4 }}>
                  {!collapsed && (
                     <Typography
                        sx={{
                           fontSize: 11,
                           fontWeight: 600,
                           textTransform: 'uppercase',
                           letterSpacing: '0.05em',
                           color: colors.muted,
                           mb: 1,
                           px: 1.5,
                        }}
                     >
                        {section.title}
                     </Typography>
                  )}
                  <List disablePadding>
                     {section.items.map((item) => {
                        const Icon = item.icon
                        const isExpanded = expandedSections[item.label]

                        if (item.children) {
                           if (collapsed) {
                              return (
                                 <ListItem key={item.label} disablePadding sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                                    <Tooltip title={item.label} placement="right">
                                       <ListItemButton
                                          onClick={() => { setCollapsed(false); toggleSection(item.label) }}
                                          aria-label={item.label}
                                          sx={{
                                             justifyContent: 'center',
                                             width: 40,
                                             height: 40,
                                             borderRadius: 1,
                                             ...inactiveItemSx,
                                          }}
                                       >
                                          {Icon && <Icon size={20} />}
                                       </ListItemButton>
                                    </Tooltip>
                                 </ListItem>
                              )
                           }
                           return (
                              <Box key={item.label}>
                                 <ListItem disablePadding>
                                    <ListItemButton
                                       onClick={() => toggleSection(item.label)}
                                       sx={{
                                          borderRadius: 1,
                                          px: 1.5,
                                          py: 1.25,
                                          gap: 1.5,
                                          ...inactiveItemSx,
                                       }}
                                    >
                                       <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                                          {Icon && <Icon size={18} />}
                                       </ListItemIcon>
                                       <ListItemText
                                          primary={item.label}
                                          sx={{ my: 0 }}
                                          slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
                                       />
                                       {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </ListItemButton>
                                 </ListItem>
                                 <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List disablePadding sx={{ pl: 3, mt: 0.25 }}>
                                       {item.children.map((child) => {
                                          const isChildActive = child.path === url
                                          return (
                                             <ListItem key={child.path} disablePadding sx={{ mb: 0.5 }}>
                                                <ListItemButton
                                                   component={SidebarLink as React.ElementType}
                                                   href={child.path!}
                                                   sx={{
                                                      borderRadius: 1,
                                                      px: 1.5,
                                                      py: 1,
                                                      gap: 1.5,
                                                      ...(isChildActive ? activeItemSx : inactiveItemSx),
                                                   }}
                                                >
                                                   <ListItemText
                                                      primary={child.label}
                                                      sx={{ my: 0 }}
                                                      slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
                                                   />
                                                   {renderBadge(child.badge, isChildActive)}
                                                </ListItemButton>
                                             </ListItem>
                                          )
                                       })}
                                    </List>
                                 </Collapse>
                              </Box>
                           )
                        }

                        const isActive = item.path === url
                        if (collapsed) {
                           return (
                              <ListItem key={item.path} disablePadding sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                                 <Tooltip title={item.label} placement="right">
                                    <ListItemButton
                                       component={SidebarLink as React.ElementType}
                                       href={item.path!}
                                       aria-label={item.label}
                                       sx={{
                                          position: 'relative',
                                          justifyContent: 'center',
                                          width: 40,
                                          height: 40,
                                          borderRadius: 1,
                                          ...(isActive ? activeItemSx : inactiveItemSx),
                                          borderRight: 'none',
                                          ...(isActive
                                             ? {
                                                '&::after': {
                                                   content: '""',
                                                   position: 'absolute',
                                                   left: 0,
                                                   top: '50%',
                                                   transform: 'translateY(-50%)',
                                                   height: 20,
                                                   width: 2,
                                                   borderRadius: '9999px',
                                                   bgcolor: '#ffffff',
                                                },
                                             }
                                             : {}),
                                       }}
                                    >
                                       {Icon && <Icon size={20} />}
                                    </ListItemButton>
                                 </Tooltip>
                              </ListItem>
                           )
                        }

                        return (
                           <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                              <ListItemButton
                                 component={SidebarLink as React.ElementType}
                                 href={item.path!}
                                 sx={{
                                    borderRadius: 1,
                                    px: 1.5,
                                    py: 1.25,
                                    gap: 1.5,
                                    ...(isActive ? activeItemSx : inactiveItemSx),
                                 }}
                              >
                                 <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                                    {Icon && <Icon size={18} />}
                                 </ListItemIcon>
                                 <ListItemText
                                    primary={item.label}
                                    sx={{ my: 0 }}
                                    slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
                                 />
                                 {renderBadge(item.badge, isActive)}
                              </ListItemButton>
                           </ListItem>
                        )
                     })}
                  </List>
               </Box>
            ))}
         </Box>

         {/* Profile */}
         <Box sx={{ borderTop: `1px solid ${colors.primary100}`, px: 2, py: 2 }}>
            {collapsed ? (
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Profile" placement="right">
                     <IconButton
                        onClick={() => router.visit('/profile')}
                        aria-label="Profile"
                        sx={{ borderRadius: 1, '&:hover': { bgcolor: colors.primary50 } }}
                     >
                        <Avatar
                           sx={{
                              width: 32,
                              height: 32,
                              backgroundImage: `linear-gradient(135deg, #7aab7a, ${colors.primary600})`,
                              fontSize: 12,
                              fontWeight: 600,
                           }}
                        >
                           {(user?.name ?? 'U').charAt(0).toUpperCase()}
                        </Avatar>
                     </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout" placement="right">
                     <IconButton
                        onClick={handleLogout}
                        aria-label="Logout"
                        sx={{ borderRadius: 1, color: '#f87171', '&:hover': { color: '#dc2626', bgcolor: '#fef2f2' } }}
                     >
                        <LogOut size={18} />
                     </IconButton>
                  </Tooltip>
               </Box>
            ) : (
               <>
                  <ListItemButton
                     onClick={() => router.visit('/profile')}
                     sx={{ borderRadius: 1, px: 1.5, py: 1, '&:hover': { bgcolor: colors.primary50 } }}
                  >
                     <Avatar
                        sx={{
                           width: 36,
                           height: 36,
                           flexShrink: 0,
                           backgroundImage: `linear-gradient(135deg, #7aab7a, ${colors.primary600})`,
                           fontSize: 12,
                           fontWeight: 600,
                           mr: 1.5,
                        }}
                     >
                        {(user?.name ?? 'U').charAt(0).toUpperCase()}
                     </Avatar>
                     <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                           {user?.name ?? 'User'}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: colors.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                           {user?.email ?? ''}
                        </Typography>
                     </Box>
                  </ListItemButton>
                  <ListItemButton
                     onClick={handleLogout}
                     sx={{
                        borderRadius: 1,
                        mt: 0.5,
                        px: 1.5,
                        py: 1,
                        gap: 1.5,
                        color: '#f87171',
                        '&:hover': { color: '#dc2626', bgcolor: '#fef2f2' },
                     }}
                  >
                     <LogOut size={18} />
                     <Typography sx={{ fontSize: 14 }}>Logout</Typography>
                  </ListItemButton>
               </>
            )}
         </Box>
      </Box>
   )
}

export default Sidebar
