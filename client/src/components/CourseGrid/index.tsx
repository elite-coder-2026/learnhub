import SearchOffIcon from '@mui/icons-material/SearchOff'
import { useTheme } from 'styled-components'
import CourseCard from '../CourseCard'
import Button from '../Button'
import InlineError from '../InlineError'
import Skeleton from '../Skeleton'
import type { CourseWithStats } from '../../types/course'
import type { UserRole } from '../../types/auth'
import * as S from './CourseGrid.styles'

interface CourseGridProps {
  courses: CourseWithStats[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  emptyMessage: string
  hasActiveFilters: boolean
  viewerRole: UserRole | null
  progressByCourseId: Map<string, number>
  buildHref: (courseId: string) => string
  onClearFilters: () => void
}

const SKELETON_KEYS = ['skeleton-a', 'skeleton-b', 'skeleton-c', 'skeleton-d', 'skeleton-e', 'skeleton-f']

const SkeletonCard = (): React.ReactElement => {
  const theme = useTheme()
  return (
    <S.SkeletonCard aria-hidden="true">
      <S.SkeletonCover />
      <S.SkeletonBody>
        <Skeleton height={theme.fontSizes.md} width="85%" />
        <Skeleton height={theme.fontSizes.md} width="60%" />
        <Skeleton height={theme.fontSizes.sm} />
        <Skeleton height={theme.fontSizes.sm} width="70%" />
        <S.SkeletonFooter>
          <Skeleton height={theme.fontSizes.xs} width="40%" />
          <Skeleton height={theme.spacing[8]} width="30%" radius="sm" />
        </S.SkeletonFooter>
      </S.SkeletonBody>
    </S.SkeletonCard>
  )
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading,
  isError,
  errorMessage = 'Failed to load courses.',
  emptyMessage,
  hasActiveFilters,
  viewerRole,
  progressByCourseId,
  buildHref,
  onClearFilters,
}) => {
  if (isLoading) {
    return (
      <S.Grid aria-busy="true" aria-label="Loading courses">
        {SKELETON_KEYS.map((key) => (
          <SkeletonCard key={key} />
        ))}
      </S.Grid>
    )
  }

  if (isError) return <InlineError message={errorMessage} />

  if (courses.length === 0) {
    return (
      <S.Empty>
        <S.EmptyIcon aria-hidden="true">
          <SearchOffIcon fontSize="inherit" />
        </S.EmptyIcon>
        <S.EmptyMessage>{emptyMessage}</S.EmptyMessage>
        {hasActiveFilters && (
          <Button variant="secondary" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </S.Empty>
    )
  }

  return (
    <S.Grid>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          to={buildHref(course.id)}
          viewerRole={viewerRole}
          progressPercent={progressByCourseId.get(course.id) ?? null}
        />
      ))}
    </S.Grid>
  )
}

export default CourseGrid
