import { useState, type ReactNode } from 'react'
import Sidebar, { type SidebarNavItem } from '../Sidebar'
import TopBar from '../TopBar'
import * as S from './AppShell.styles'

interface AppShellProps {
  navItems: SidebarNavItem[]
  children: ReactNode
}

const AppShell: React.FC<AppShellProps> = ({ navItems, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <S.Grid $isCollapsed={isSidebarCollapsed}>
      <S.SidebarArea>
        <Sidebar items={navItems} isCollapsed={isSidebarCollapsed} />
      </S.SidebarArea>
      <S.TopBarArea>
        <TopBar
          navItems={navItems}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </S.TopBarArea>
      <S.ContentArea>{children}</S.ContentArea>
    </S.Grid>
  )
}

export default AppShell
