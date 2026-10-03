import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ProgressBar from '../ProgressBar'
import * as S from './CourseProgressCard.styles'

interface CourseProgressCardProps {
  courseId: string
  title: string
  description: string | null
  completedLessons: number
  totalLessons: number
  percentComplete: number
}

const THUMBNAIL_VARIANT_COUNT = 4

const getThumbnailVariant = (courseId: string): number =>
  [...courseId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % THUMBNAIL_VARIANT_COUNT

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  courseId,
  title,
  description,
  completedLessons,
  totalLessons,
  percentComplete,
}) => (
  <S.Container to={`/courses/${courseId}/learn`} aria-label={`Continue ${title}`}>
    <S.Thumbnail $variant={getThumbnailVariant(courseId)} aria-hidden="true">
      {title.trim().charAt(0).toUpperCase()}
    </S.Thumbnail>
    <S.Body>
      <S.Title>{title}</S.Title>
      <S.Meta>{description?.trim() || `${percentComplete}% complete`}</S.Meta>
      <ProgressBar percent={percentComplete} label={`${title} progress`} />
      <S.Footer>
        <S.LessonCount>
          {completedLessons} of {totalLessons} lessons
        </S.LessonCount>
        <S.ContinueButton>
          Continue
          <ArrowForwardIcon fontSize="inherit" />
        </S.ContinueButton>
      </S.Footer>
    </S.Body>
  </S.Container>
)

export default CourseProgressCard
