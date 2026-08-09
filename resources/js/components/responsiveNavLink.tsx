import { Link as InertiaLink } from '@inertiajs/react'
import { styled } from '@mui/material/styles'
import type { ComponentPropsWithoutRef } from 'react'

type Props = {
   active?: boolean
} & ComponentPropsWithoutRef<typeof InertiaLink>

const StyledLink = styled(InertiaLink, {
   shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
   display: 'block',
   width: '100%',
   borderLeft: `4px solid ${active ? theme.palette.primary.light : 'transparent'}`,
   padding: theme.spacing(1, 1.5),
   color: active ? theme.palette.primary.dark : theme.palette.text.secondary,
   textDecoration: 'none',
   '&:hover': {
      backgroundColor: active ? '#e3f0e3' : theme.palette.action.hover,
      color: active ? theme.palette.primary.dark : theme.palette.text.primary,
   },
}))

const ResponsiveNavLink = ({ active = false, children, ...props }: Props) => (
   <StyledLink {...props} active={active}>
      {children}
   </StyledLink>
)

export default ResponsiveNavLink
