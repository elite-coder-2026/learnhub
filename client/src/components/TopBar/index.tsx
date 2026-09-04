import { useAuth } from '../../hooks/useAuth'
import Button from '../Button'
import * as S from './TopBar.styles'

interface TopBarProps {
  onToggleSidebar: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()

  return (
    <S.Bar>
      <S.ToggleButton type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        ☰
      </S.ToggleButton>
      <S.Brand>LearnHub</S.Brand>
      {user && (
        <S.UserArea>
          <S.RoleText>{user.role}</S.RoleText>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </S.UserArea>
      )}
    </S.Bar>
  )
}

export default TopBar
