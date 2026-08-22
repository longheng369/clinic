import { Link as InertiaLink } from '@inertiajs/react'
import { styled } from '@mui/material/styles'
import type { ComponentPropsWithoutRef } from 'react'

type Props = {
   active?: boolean
} & ComponentPropsWithoutRef<typeof InertiaLink>

const StyledLink = styled(InertiaLink, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderBottom: `2px solid ${active ? theme.palette.primary.light : 'transparent'}`,
  padding: theme.spacing(0.5, 0.5, 0),
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.25,
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.text.primary,
    borderColor: active ? theme.palette.primary.dark : theme.palette.divider,
  },
}))

const NavLink = ({ active = false, children, ...props }: Props) => (
  <StyledLink {...props} active={active}>
    {children}
  </StyledLink>
)

export default NavLink
