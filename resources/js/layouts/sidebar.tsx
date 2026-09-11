import React, { useState } from 'react';
import { Link as InertiaLink, usePage, router } from '@inertiajs/react';
import { sidebarSections } from '@/config/sidebar';
import type { ISidebarOption } from '@/interfaces/ISidebar';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

const SidebarLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof InertiaLink>
>(({ children, ...props }, ref) => (
  <InertiaLink {...props} ref={ref}>
    {children}
  </InertiaLink>
));
SidebarLink.displayName = 'SidebarLink';

const Sidebar = () => {
  const theme = useTheme();
  const { url, props: pageProps } = usePage();
  const user = pageProps.auth?.user;
  const pathname = url.split('?')[0];

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    Settings: true,
  });

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  const activeGradient = `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`;

  const activeItemSx = {
    color: theme.palette.primary.contrastText,
    backgroundImage: activeGradient,
    boxShadow: `0 4px 6px -1px ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRight: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      color: theme.palette.primary.contrastText,
      backgroundImage: activeGradient,
    },
  };

  const inactiveItemSx = {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
      bgcolor: alpha(theme.palette.primary.main, 0.08),
    },
  };

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
          bgcolor: isActive
            ? theme.palette.primary.main
            : alpha(theme.palette.primary.main, 0.12),
          color: isActive
            ? theme.palette.primary.contrastText
            : theme.palette.primary.dark,
        }}
      >
        {badge}
      </Box>
    ) : null;

  const renderSidebarItem = (item: ISidebarOption): React.ReactNode => {
    const Icon = item.icon;
    const isExpanded = expandedSections[item.label];

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
              <ListItemText primary={item.label} sx={{ my: 0 }} />
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List disablePadding sx={{ pl: 3, mt: 0.25 }}>
              {item.children.map((child) => renderSidebarItem(child))}
            </List>
          </Collapse>
        </Box>
      );
    }

    const isActive = item.path === pathname;

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
    );
  };

  return (
    <Box
      component="aside"
      sx={{
        position: 'relative',
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
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
          component="img"
          src="/storage/hospital-logo.jpeg"
          alt="Hospital logo"
          sx={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0 }}
        />
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
                color: theme.palette.text.secondary,
              }}
            >
              {section.title}
            </Typography>
            <List>{section.items.map((item) => renderSidebarItem(item))}</List>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          px: 2,
          py: 2,
        }}
      >
        <ListItemButton
          onClick={() => router.visit('/profile')}
          sx={{
            borderRadius: 1,
            px: 1.5,
            py: 1,
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              fontSize: 12,
              fontWeight: 600,
              mr: 1.5,
            }}
          >
            {(user?.name ?? 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: theme.palette.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name ?? 'User'}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: theme.palette.text.secondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
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
            color: theme.palette.error.light,
            '&:hover': {
              color: theme.palette.error.main,
              bgcolor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <LogOut size={18} />
          <Typography sx={{ fontSize: 14 }}>Logout</Typography>
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
