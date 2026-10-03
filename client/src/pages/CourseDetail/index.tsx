import { useNavigate, useParams } from 'react-router-dom'
import * as S from './CourseDetail.styles'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import Skeleton from '../../components/Skeleton'
import InlineError from '../../components/InlineError'
import LessonList from '../../components/LessonList'
import { NAV_BY_ROLE, PUBLIC_NAV } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/price'
import { useCourse } from '../../hooks/useCourse'
import { useEnroll } from '../../hooks/useEnroll'
import { useStudentDashboard } from '../../hooks/useDashboardQueries'

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const course = useCourse(id)
  const dashboard = useStudentDashboard()
  const enroll = useEnroll(id ?? '')

  const isEnrolled = Boolean(
    id &&
      dashboard.data &&
      [...dashboard.data.inProgress, ...dashboard.data.completed].some(
        (c) => c.course_id === id,
      ),
  )

  return (
    <AppShell navItems={user ? NAV_BY_ROLE[user.role] : PUBLIC_NAV}>
      <Container>
        <S.Body>
          {course.isLoading && (
            <S.LoadingBlock>
              <Skeleton height="28px" width="50%" />
              <Skeleton height="16px" />
              <Skeleton height="16px" width="80%" />
            </S.LoadingBlock>
          )}

          {course.isError && (
            <InlineError message={course.error.message} />
          )}

          {course.data && (
            <>
              <PageHeader title={course.data.title} />
              <S.Description>{course.data.description}</S.Description>

              {(course.data.level || course.data.category) && (
                <S.Meta>
                  {course.data.level && <S.Badge>{course.data.level}</S.Badge>}
                  {course.data.category && (
                    <S.Badge>{course.data.category}</S.Badge>
                  )}
                </S.Meta>
              )}

              <S.Price $isFree={course.data.price_cents === 0}>{formatPrice(course.data.price_cents)}</S.Price>
              <S.Actions>
                {isEnrolled ? (
                  <>
                    <S.EnrolledNote>You are enrolled.</S.EnrolledNote>
                    <Button
                      onClick={() => navigate(`/courses/${course.data.id}/learn`)}
                    >
                      Go to course
                    </Button>
                  </>
                ) : (
                  <>
                    {course.data.price_cents > 0 ? (
                      <Button variant="secondary" disabled>
                        Checkout coming soon
                      </Button>
                    ) : (
                      <Button
                        onClick={() => (user ? enroll.mutate() : navigate('/login'))}
                        isLoading={enroll.isPending}
                        disabled={dashboard.isLoading}
                      >
                        Enroll
                      </Button>
                    )}
                    {enroll.isError && (
                      <InlineError message={enroll.error.message} />
                    )}
                  </>
                )}
              </S.Actions>

              <S.SectionTitle>Curriculum</S.SectionTitle>
              <LessonList modules={course.data.modules} />
            </>
          )}
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default CourseDetail
