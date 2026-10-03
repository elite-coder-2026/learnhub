import { useNavigate } from 'react-router-dom'
import CategoryIcon from '@mui/icons-material/Category'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Button from '../Button'
import ProgressBar from '../ProgressBar'
import InlineError from '../InlineError'
import { useEnroll } from '../../hooks/useEnroll'
import type { Course } from '../../types/course'
import type { UserRole } from '../../types/auth'
import * as S from './CourseCard.styles'

interface CourseCardProps {
  course: Course
  to: string
  viewerRole: UserRole | null
  progressPercent: number | null
}

const COVER_VARIANT_COUNT = 5

const getCoverVariant = (courseId: string): number =>
  [...courseId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % COVER_VARIANT_COUNT

const CourseCard: React.FC<CourseCardProps> = ({ course, to, viewerRole, progressPercent }) => {
  const navigate = useNavigate()
  const enroll = useEnroll(course.id)
  const isEnrolled = progressPercent !== null

  return (
    <S.Container>
      <S.Cover $variant={getCoverVariant(course.id)} aria-hidden="true">
        <S.CoverInitial>{course.title.trim().charAt(0).toUpperCase()}</S.CoverInitial>
        {course.level && <S.LevelBadge>{course.level}</S.LevelBadge>}
      </S.Cover>

      <S.Body>
        <S.Title>
          <S.CardLink to={to}>{course.title}</S.CardLink>
        </S.Title>
        {course.description && <S.Description>{course.description}</S.Description>}

        {course.category && (
          <S.MetaRow>
            <S.MetaItem>
              <CategoryIcon fontSize="inherit" aria-hidden="true" />
              {course.category}
            </S.MetaItem>
          </S.MetaRow>
        )}

        <S.Footer>
          {viewerRole === 'student' && isEnrolled && (
            <>
              <S.ProgressGroup>
                <ProgressBar percent={progressPercent} label={`${course.title} progress`} />
                <S.ProgressText>{progressPercent}% complete</S.ProgressText>
              </S.ProgressGroup>
              <S.Action>
                <Button size="sm" onClick={() => navigate(`/courses/${course.id}/learn`)}>
                  Continue
                  <ArrowForwardIcon fontSize="inherit" />
                </Button>
              </S.Action>
            </>
          )}
          {viewerRole === 'student' && !isEnrolled && (
            <S.Action>
              <Button size="sm" isLoading={enroll.isPending} onClick={() => enroll.mutate()}>
                Enroll
              </Button>
            </S.Action>
          )}
          {viewerRole !== 'student' && (
            <S.ViewLabel aria-hidden="true">
              View course
              <ArrowForwardIcon fontSize="inherit" />
            </S.ViewLabel>
          )}
        </S.Footer>
        {enroll.isError && (
          <S.Action>
            <InlineError message={enroll.error.message} />
          </S.Action>
        )}
      </S.Body>
    </S.Container>
  )
}

export default CourseCard
