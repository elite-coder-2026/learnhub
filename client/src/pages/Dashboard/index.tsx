import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Skeleton from '../../components/Skeleton'
import { NAV_BY_ROLE } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import {
  useAdminAnalytics,
  useInstructorAnalytics,
  useStudentDashboard,
} from '../../hooks/useDashboardQueries'
import type { UserRole } from '../../types/auth'
import * as S from './Dashboard.styles'

const LOADING_ROWS = 3

function LoadingList(): React.ReactElement {
  return (
    <S.List>
      {Array.from({ length: LOADING_ROWS }, (_, i) => (
        <li key={i}>
          <Skeleton height="52px" radius="md" />
        </li>
      ))}
    </S.List>
  )
}

function StudentSection(): React.ReactElement {
  const { data, isLoading, isError, error } = useStudentDashboard()

  if (isLoading) return <LoadingList />
  if (isError) return <S.ErrorMessage role="alert">{error.message}</S.ErrorMessage>
  if (!data) return <S.Message>No data yet.</S.Message>

  return (
    <>
      <S.StatGrid>
        <S.Stat>
          <S.StatValue>{data.inProgress.length}</S.StatValue>
          <S.StatLabel>Courses in progress</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{data.completed.length}</S.StatValue>
          <S.StatLabel>Courses completed</S.StatLabel>
        </S.Stat>
      </S.StatGrid>

      <S.SectionTitle>In progress</S.SectionTitle>
      {data.inProgress.length === 0 ? (
        <S.Message>You are not enrolled in any courses yet.</S.Message>
      ) : (
        <S.List>
          {data.inProgress.map((course) => (
            <S.Row key={course.course_id}>
              <S.RowTitle>{course.title}</S.RowTitle>
              <S.RowMeta>
                {course.completed_lessons}/{course.total_lessons} lessons ·{' '}
                {course.percent_complete}%
              </S.RowMeta>
            </S.Row>
          ))}
        </S.List>
      )}
    </>
  )
}

function InstructorSection(): React.ReactElement {
  const { data, isLoading, isError, error } = useInstructorAnalytics()

  if (isLoading) return <LoadingList />
  if (isError) return <S.ErrorMessage role="alert">{error.message}</S.ErrorMessage>
  if (!data) return <S.Message>No data yet.</S.Message>

  const totalEnrollments = data.reduce(
    (sum, course) => sum + course.enrollment_count,
    0,
  )

  return (
    <>
      <S.StatGrid>
        <S.Stat>
          <S.StatValue>{data.length}</S.StatValue>
          <S.StatLabel>Courses published</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{totalEnrollments}</S.StatValue>
          <S.StatLabel>Total enrollments</S.StatLabel>
        </S.Stat>
      </S.StatGrid>

      <S.SectionTitle>Course performance</S.SectionTitle>
      {data.length === 0 ? (
        <S.Message>You have not published any courses yet.</S.Message>
      ) : (
        <S.List>
          {data.map((course) => (
            <S.Row key={course.course_id}>
              <S.RowTitle>{course.title}</S.RowTitle>
              <S.RowMeta>
                {course.enrollment_count} enrolled ·{' '}
                {Math.round(course.completion_rate * 100)}% completion
              </S.RowMeta>
            </S.Row>
          ))}
        </S.List>
      )}
    </>
  )
}

function AdminSection(): React.ReactElement {
  const { data, isLoading, isError, error } = useAdminAnalytics()

  if (isLoading) return <LoadingList />
  if (isError) return <S.ErrorMessage role="alert">{error.message}</S.ErrorMessage>
  if (!data) return <S.Message>No data yet.</S.Message>

  return (
    <>
      <S.StatGrid>
        <S.Stat>
          <S.StatValue>{data.active_users.total}</S.StatValue>
          <S.StatLabel>Active users</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{data.active_users.student}</S.StatValue>
          <S.StatLabel>Students</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{data.active_users.instructor}</S.StatValue>
          <S.StatLabel>Instructors</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{data.active_users.admin}</S.StatValue>
          <S.StatLabel>Admins</S.StatLabel>
        </S.Stat>
      </S.StatGrid>

      <S.SectionTitle>Top courses</S.SectionTitle>
      {data.top_courses.length === 0 ? (
        <S.Message>No course enrollments yet.</S.Message>
      ) : (
        <S.List>
          {data.top_courses.map((course) => (
            <S.Row key={course.course_id}>
              <S.RowTitle>{course.title}</S.RowTitle>
              <S.RowMeta>{course.enrollment_count} enrolled</S.RowMeta>
            </S.Row>
          ))}
        </S.List>
      )}
    </>
  )
}

const SECTION_BY_ROLE: Record<UserRole, () => React.ReactElement> = {
  student: StudentSection,
  instructor: InstructorSection,
  admin: AdminSection,
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) return <S.Message>Loading…</S.Message>

  const Section = SECTION_BY_ROLE[user.role]

  return (
    <AppShell navItems={NAV_BY_ROLE[user.role]}>
      <Container>
        <S.Body>
          <PageHeader
            title="Dashboard"
            description={`Signed in as ${user.role}`}
          />
          <Section />
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default Dashboard
