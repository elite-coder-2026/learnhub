import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import EmptyState from '../../components/EmptyState'
import { NAV_BY_ROLE, PUBLIC_NAV } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import * as S from './NotFound.styles'

const NotFound: React.FC = () => {
  const { user } = useAuth()

  return (
    <AppShell navItems={user ? NAV_BY_ROLE[user.role] : PUBLIC_NAV}>
      <Container>
        <S.Body>
          <S.Title>Page not found</S.Title>
          <EmptyState
            icon={TravelExploreIcon}
            message="This page doesn't exist or has moved."
            ctaLabel={user ? 'Go to dashboard' : 'Go to home'}
            ctaTo={user ? '/dashboard' : '/'}
          />
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default NotFound
