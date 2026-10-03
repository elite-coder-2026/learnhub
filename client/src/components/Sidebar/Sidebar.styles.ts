import styled, { css } from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

const hiddenWhenCollapsed = css<{ $isCollapsed: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'inline')};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.sidebarBg};
  border: 1px solid ${({ theme }) => theme.colors.sidebarBg};
  border-radius: 0;
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  min-height: ${({ theme }) => theme.sizes.avatar};
`

export const LogoBadge = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.avatar};
  height: ${({ theme }) => theme.sizes.avatar};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.sidebarActive};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const Wordmark = styled.span<{ $isCollapsed: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.sidebarActive};
  ${hiddenWhenCollapsed}
`

export const Nav = styled.nav`
  flex: 1;
`

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Link = styled(RouterLink)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.sidebarText};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.full};
  transition: background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.sidebarActive};
    background: ${({ theme }) => theme.colors.sidebarHover};
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    &&,
    &&:hover {
      color: ${theme.colors.sidebarActive};
      background: ${theme.colors.primary};
      font-weight: ${theme.fontWeights.semibold};
    }
  `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

export const Label = styled.span<{ $isCollapsed: boolean }>`
  ${hiddenWhenCollapsed}
`
