import { Link } from '@inertiajs/react'
import { Menu, MenuItem, Box } from '@mui/material'
import { createContext, useContext, useState, type ReactNode } from 'react'

const DropDownContext = createContext<{
   open: boolean
   setOpen: React.Dispatch<React.SetStateAction<boolean>>
   toggleOpen: (event: React.MouseEvent<HTMLElement>) => void
   anchorEl: HTMLElement | null
     } | null>(null)

const Dropdown = ({ children }: { children: ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    setAnchorEl((current) => {
      const next = typeof value === 'function' ? value(Boolean(current)) : value
      return next ? current : null
    })
  }
  const toggleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((current) => current ? null : event.currentTarget)
  }

  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen, anchorEl }}>
      <Box sx={{ position: 'relative' }}>{children}</Box>
    </DropDownContext.Provider>
  )
}

const Trigger = ({ children }: { children: ReactNode }) => {
  const context = useContext(DropDownContext)
  if (!context) return null

  return <Box onClick={context.toggleOpen}>{children}</Box>
}

const Content = ({
  align = 'right',
  width = '48',
  children,
}: {
   align?: 'left' | 'right'
   width?: '48'
   contentClasses?: string
   children: ReactNode
}) => {
  const context = useContext(DropDownContext)
  if (!context) return null

  return (
    <Menu
      anchorEl={context.anchorEl}
      open={context.open}
      onClose={() => context.setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: align }}
      transformOrigin={{ vertical: 'top', horizontal: align }}
      slotProps={{ paper: { sx: { mt: 1, minWidth: width === '48' ? 192 : undefined } } }}
    >
      {children}
    </Menu>
  )
}

const DropdownLink = ({ children, onClick, ...props }: React.ComponentPropsWithoutRef<typeof Link>) => {
  const context = useContext(DropDownContext)
  const linkProps = props as unknown as Record<string, unknown>

  return (
    <MenuItem
      component={Link as unknown as React.ElementType}
      {...linkProps}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event as never)
        context?.setOpen(false)
      }}
      sx={{ fontSize: '0.875rem' }}
    >
      {children}
    </MenuItem>
  )
}

Dropdown.Trigger = Trigger
Dropdown.Content = Content
Dropdown.Link = DropdownLink

export default Dropdown
