import { useLocation, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import Button from '../Button'
import { findActiveNavItem } from '../../utils/nav'
import type { SidebarNavItem } from '../Sidebar'
import * as S from './TopBar.styles'

interface TopBarProps {
  navItems: SidebarNavItem[]
  onToggleSidebar: () => void
}

const findPageTitle = (navItems: SidebarNavItem[], pathname: string): string =>
  findActiveNavItem(navItems, pathname)?.label ?? 'LearnHub'

const getInitials = (firstName: string | null, lastName: string | null, fallback: string): string => {
  const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  return initials || fallback.charAt(0).toUpperCase()
}

const TopBar: React.FC<TopBarProps> = ({ navItems, onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const { data: currentUser } = useCurrentUser()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    navigate('/', { replace: true })
    logout()
  }

  return (
    <S.Bar>
      <S.ToggleButton type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <MenuIcon fontSize="inherit" />
      </S.ToggleButton>
      <S.Title>{findPageTitle(navItems, pathname)}</S.Title>
      {user && (
        <S.UserArea>
          <S.Avatar aria-hidden="true">
            {getInitials(currentUser?.first_name ?? null, currentUser?.last_name ?? null, user.role)}
          </S.Avatar>
          <S.RoleBadge>{user.role}</S.RoleBadge>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </S.UserArea>
      )}
    </S.Bar>
  )
}

export default TopBar
