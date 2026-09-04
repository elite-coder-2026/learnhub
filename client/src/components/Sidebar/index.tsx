import * as S from './Sidebar.styles'

export interface SidebarNavItem {
  label: string
  to: string
}

interface SidebarProps {
  items: SidebarNavItem[]
  isCollapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ items, isCollapsed }) => (
  <S.Nav aria-label="Primary">
    <S.List>
      {items.map((item) => (
        <li key={item.to}>
          <S.Link to={item.to} $isCollapsed={isCollapsed}>
            {item.label}
          </S.Link>
        </li>
      ))}
    </S.List>
  </S.Nav>
)

export default Sidebar
