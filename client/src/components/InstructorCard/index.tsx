import MenuBookIcon from '@mui/icons-material/MenuBook'
import PeopleIcon from '@mui/icons-material/People'
import type { TopInstructor } from '../../types/user'
import * as S from './InstructorCard.styles'

interface InstructorCardProps {
  instructor: TopInstructor
}

const getDisplayName = (instructor: TopInstructor): string =>
  [instructor.first_name, instructor.last_name].filter(Boolean).join(' ') || 'Instructor'

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  const name = getDisplayName(instructor)

  return (
    <S.Container>
      {instructor.avatar_url ? (
        <S.AvatarImage src={instructor.avatar_url} alt="" />
      ) : (
        <S.Avatar aria-hidden="true">{getInitials(name)}</S.Avatar>
      )}
      <S.Name>{name}</S.Name>
      <S.Stats>
        <S.Stat>
          <MenuBookIcon fontSize="inherit" aria-hidden="true" />
          {instructor.course_count} {instructor.course_count === 1 ? 'course' : 'courses'}
        </S.Stat>
        <S.Stat>
          <PeopleIcon fontSize="inherit" aria-hidden="true" />
          {instructor.student_count} {instructor.student_count === 1 ? 'student' : 'students'}
        </S.Stat>
      </S.Stats>
    </S.Container>
  )
}

export default InstructorCard
