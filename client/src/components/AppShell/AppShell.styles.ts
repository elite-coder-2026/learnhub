import styled from 'styled-components'

export const Grid = styled.div<{ $isCollapsed: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isCollapsed }) => ($isCollapsed ? '64px' : '220px')} 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'sidebar topbar'
    'sidebar content';
  min-height: 100vh;
  transition: grid-template-columns 0.2s ease;
`

export const SidebarArea = styled.aside`
  grid-area: sidebar;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`

export const TopBarArea = styled.div`
  grid-area: topbar;
`

export const ContentArea = styled.main`
  grid-area: content;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
`
