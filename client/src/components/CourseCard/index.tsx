import * as S from './CourseCard.styles'
import type { Course } from '../../types/course'

interface CourseCardProps {
  course: Course
  to: string
}

const CourseCard: React.FC<CourseCardProps> = ({ course, to }) => (
  <S.Container to={to}>
    <S.Title>{course.title}</S.Title>
    <S.Description>{course.description}</S.Description>
    <S.Meta>
      {course.level && <S.Badge>{course.level}</S.Badge>}
      {course.category && <S.Badge>{course.category}</S.Badge>}
    </S.Meta>
  </S.Container>
)

export default CourseCard
