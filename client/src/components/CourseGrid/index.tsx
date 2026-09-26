import * as S from './CourseGrid.styles'
import CourseCard from '../CourseCard'
import InlineError from '../InlineError'
import Skeleton from '../Skeleton'
import type { Course } from '../../types/course'

interface CourseGridProps {
  courses: Course[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  emptyMessage?: string
  buildHref: (courseId: string) => string
}

const SKELETON_COUNT = 6

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading,
  isError,
  errorMessage = 'Failed to load courses.',
  emptyMessage = 'No courses found.',
  buildHref,
}) => {
  if (isLoading) {
    return (
      <S.Grid>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <S.SkeletonCard key={i}>
            <Skeleton height="24px" width="70%" />
            <Skeleton height="14px" />
            <Skeleton height="14px" width="85%" />
          </S.SkeletonCard>
        ))}
      </S.Grid>
    )
  }

  if (isError) return <InlineError message={errorMessage} />

  if (courses.length === 0) return <S.Empty>{emptyMessage}</S.Empty>

  return (
    <S.Grid>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          to={buildHref(course.id)}
        />
      ))}
    </S.Grid>
  )
}

export default CourseGrid
