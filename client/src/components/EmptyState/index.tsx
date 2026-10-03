import type { SvgIconComponent } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import * as S from './EmptyState.styles'

interface EmptyStateProps {
  icon: SvgIconComponent
  message: string
  ctaLabel: string
  ctaTo: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message, ctaLabel, ctaTo }) => {
  const navigate = useNavigate()

  return (
    <S.Container>
      <S.IconBadge aria-hidden="true">
        <Icon fontSize="inherit" />
      </S.IconBadge>
      <S.Message>{message}</S.Message>
      <Button variant="primary" size="sm" onClick={() => navigate(ctaTo)}>
        {ctaLabel}
      </Button>
    </S.Container>
  )
}

export default EmptyState
