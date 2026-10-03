import BlockIcon from '@mui/icons-material/Block'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import EmptyState from '../../components/EmptyState'
import { NAV_BY_ROLE, PUBLIC_NAV } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import * as S from './Forbidden.styles'

const Forbidden: React.FC = () => {
  const { user } = useAuth()

  return (
    <AppShell navItems={user ? NAV_BY_ROLE[user.role] : PUBLIC_NAV}>
      <Container>
        <S.Body>
          <S.Title>Access denied</S.Title>
          <EmptyState
            icon={BlockIcon}
            message="You don't have permission to view this page."
            ctaLabel={user ? 'Go to dashboard' : 'Go to home'}
            ctaTo={user ? '/dashboard' : '/'}
          />
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default Forbidden
