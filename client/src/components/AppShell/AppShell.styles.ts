import styled from 'styled-components'

export const Grid = styled.div<{ $isCollapsed: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isCollapsed, theme }) =>
      $isCollapsed ? theme.sizes.sidebarCollapsed : theme.sizes.sidebar} minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'sidebar topbar'
    'sidebar content';
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  transition: grid-template-columns ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: ${({ theme }) => theme.sizes.sidebarCollapsed} minmax(0, 1fr);
  }
`

export const SidebarArea = styled.aside`
  grid-area: sidebar;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.sidebarBg};
`

export const TopBarArea = styled.div`
  grid-area: topbar;
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.topBar};
`

export const ContentArea = styled.main`
  grid-area: content;
  min-width: 0;
  background: ${({ theme }) => theme.colors.bg};
`
