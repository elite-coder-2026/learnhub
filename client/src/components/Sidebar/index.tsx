import type { SvgIconComponent } from '@mui/icons-material'
import SchoolIcon from '@mui/icons-material/School'
import * as S from './Sidebar.styles'

export interface SidebarNavItem {
  label: string
  to: string
  icon: SvgIconComponent
}

interface SidebarProps {
  items: SidebarNavItem[]
  isCollapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ items, isCollapsed }) => (
  <S.Container>
    <S.Brand>
      <S.LogoBadge>
        <SchoolIcon fontSize="inherit" />
      </S.LogoBadge>
      <S.Wordmark $isCollapsed={isCollapsed}>LearnHub</S.Wordmark>
    </S.Brand>
    <S.Nav aria-label="Primary">
      <S.List>
        {items.map(({ label, to, icon: Icon }) => (
          <li key={to}>
            <S.Link to={to} title={label} aria-label={label}>
              <S.IconSlot>
                <Icon fontSize="inherit" />
              </S.IconSlot>
              <S.Label $isCollapsed={isCollapsed}>{label}</S.Label>
            </S.Link>
          </li>
        ))}
      </S.List>
    </S.Nav>
  </S.Container>
)

export default Sidebar
