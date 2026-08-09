import React, { useState } from 'react'
import { Link as InertiaLink, usePage, router } from '@inertiajs/react'
import { sidebarSections } from '@/config/sidebar'
import type { ISidebarOption } from '@/interfaces/ISidebar'
import {
   Stethoscope,
   LogOut,
   ChevronDown,
   ChevronRight,
   PanelLeft,
   PanelRight,
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

   const toggleSection = (label: string) => {
      setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }))
   }

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

   const renderSidebarItem = (item: ISidebarOption, nested = false): React.ReactNode => {
      const Icon = item.icon
      const isExpanded = expandedSections[item.label]

      if (item.children) {
         return (
            <Box key={item.label}>
               <ListItem disablePadding>
                  <ListItemButton
                     onClick={() => toggleSection(item.label)}
                     sx={{
                        borderRadius: 1,
                        ...inactiveItemSx,
                     }}
                  >
                     <ListItemIcon sx={{ color: 'inherit' }}>
                        {Icon && <Icon size={16} />}
                     </ListItemIcon>
                     <ListItemText
                        primary={item.label}
                        sx={{ my: 0 }}
                        
                     />
                     {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </ListItemButton>
               </ListItem>
               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 3, mt: 0.25 }}>
                     {item.children.map((child) => renderSidebarItem(child, true))}
                  </List>
               </Collapse>
            </Box>
         )
      }

      const isActive = item.path === url

      return (
         <ListItem key={item.path ?? item.label} disablePadding>
            <ListItemButton
               component={SidebarLink as React.ElementType}
               href={item.path!}
               sx={{
                  borderRadius: 1,
                  ...(isActive ? activeItemSx : inactiveItemSx),
               }}
            >
               <ListItemIcon sx={{ color: 'inherit' }}>
                  {Icon && <Icon size={16} />}
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
   }

   return (
      <Box
         component="aside"
         sx={{
            position: 'relative',
            height: '100%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#ffffff',
            borderRight: `1px solid ${colors.border}`,
            zIndex: 30,
            width: 300,
            transition: 'width 200ms ease',
         }}
      >
         <Box
            sx={{
               display: 'flex',
               alignItems: 'center',
               gap: 1.5,
               px: 3,
               py: 2.5,
               justifyContent: 'flex-start',
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
         </Box>

         <Box component="nav" sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
            {sidebarSections.map((section) => (
               <Box key={section.title}>
                  <Typography
                     sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: colors.muted,
                     }}
                  >
                     {section.title}
                  </Typography>
                  <List>
                     {section.items.map((item) => renderSidebarItem(item))}
                  </List>
               </Box>
            ))}
         </Box>

         <Box sx={{ borderTop: `1px solid ${colors.primary100}`, px: 2, py: 2 }}>
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
         </Box>
      </Box>
   )
}

export default Sidebar
