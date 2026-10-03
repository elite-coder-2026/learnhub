import * as S from './StatusBadge.styles'

export type StatusTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface StatusBadgeProps {
  tone: StatusTone
  children: React.ReactNode
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ tone, children }) => <S.Badge $tone={tone}>{children}</S.Badge>

export default StatusBadge
