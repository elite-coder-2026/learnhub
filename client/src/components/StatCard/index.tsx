import type { SvgIconComponent } from '@mui/icons-material'
import * as S from './StatCard.styles'

interface StatCardProps {
  icon: SvgIconComponent
  value: number
  label: string
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
  <S.Container>
    <S.IconBadge aria-hidden="true">
      <Icon fontSize="inherit" />
    </S.IconBadge>
    <S.Text>
      <S.Value>{value}</S.Value>
      <S.Label>{label}</S.Label>
    </S.Text>
  </S.Container>
)

export default StatCard
