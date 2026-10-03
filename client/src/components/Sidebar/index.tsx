import type { SvgIconComponent } from '@mui/icons-material'
import SchoolIcon from '@mui/icons-material/School'
import { useLocation } from 'react-router-dom'
import { findActiveNavItem } from '../../utils/nav'
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

const Sidebar: React.FC<SidebarProps> = ({ items, isCollapsed }) => {
  const { pathname } = useLocation()
  const activeTo = findActiveNavItem(items, pathname)?.to

  return (
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
            <S.Link
              to={to}
              title={label}
              aria-label={label}
              aria-current={to === activeTo ? 'page' : undefined}
              $isActive={to === activeTo}
            >
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
}

export default Sidebar
