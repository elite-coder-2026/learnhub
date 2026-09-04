import type { AppTheme } from '../../theme'
import * as S from './Skeleton.styles'

interface SkeletonProps {
  width?: string
  height?: string
  radius?: keyof AppTheme['borderRadius']
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = '1rem', radius = 'sm' }) => (
  <S.Block $width={width} $height={height} $radius={radius} aria-hidden="true" />
)

export default Skeleton
