import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import InsightsIcon from '@mui/icons-material/Insights'
import GroupsIcon from '@mui/icons-material/Groups'
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Skeleton from '../../components/Skeleton'
import InlineError from '../../components/InlineError'
import StatCard from '../../components/StatCard'
import CourseProgressCard from '../../components/CourseProgressCard'
import EmptyState from '../../components/EmptyState'
import { NAV_BY_ROLE } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useCertificates } from '../../hooks/useCertificates'
import {
  useAdminAnalytics,
  useInstructorAnalytics,
  useStudentDashboard,
} from '../../hooks/useDashboardQueries'
import { useTheme } from 'styled-components'
import type { UserRole } from '../../types/auth'
import * as S from './Dashboard.styles'

const LOADING_STAT_CARDS = ['stat-a', 'stat-b', 'stat-c', 'stat-d']
const LOADING_ROWS = ['row-a', 'row-b']

const LoadingStats = (): React.ReactElement => {
  const theme = useTheme()
  return (
    <S.StatGrid>
      {LOADING_STAT_CARDS.map((key) => (
        <Skeleton key={key} height={theme.sizes.statCardSkeleton} radius="lg" />
      ))}
    </S.StatGrid>
  )
}

const LoadingRows = (): React.ReactElement => {
  const theme = useTheme()
  return (
    <S.CourseGrid>
      {LOADING_ROWS.map((key) => (
        <Skeleton key={key} height={theme.sizes.courseCardSkeleton} radius="lg" />
      ))}
    </S.CourseGrid>
  )
}

const StudentSection = (): React.ReactElement => {
  const dashboard = useStudentDashboard()
  const certificates = useCertificates()

  if (dashboard.isLoading) {
    return (
      <>
        <LoadingStats />
        <LoadingRows />
      </>
    )
  }
  if (dashboard.isError) return <InlineError message={dashboard.error.message} />
  if (!dashboard.data) return <InlineError message="Dashboard data is unavailable." />

  const { inProgress, completed } = dashboard.data
  const lessonsCompleted = [...inProgress, ...completed].reduce(
    (sum, course) => sum + course.completed_lessons,
    0,
  )

  return (
    <>
      <S.StatGrid>
        <StatCard icon={AutoStoriesIcon} value={inProgress.length} label="Courses in progress" />
        <StatCard icon={TaskAltIcon} value={completed.length} label="Courses completed" />
        <StatCard
          icon={WorkspacePremiumIcon}
          value={certificates.data?.length ?? 0}
          label="Certificates earned"
        />
        <StatCard icon={CheckCircleIcon} value={lessonsCompleted} label="Lessons completed" />
      </S.StatGrid>
      {certificates.isError && <InlineError message={certificates.error.message} />}

      <S.Panel>
        <S.PanelHeader>
          <S.PanelTitle>Continue learning</S.PanelTitle>
        </S.PanelHeader>
        {inProgress.length === 0 ? (
          <EmptyState
            icon={MenuBookIcon}
            message="You have no courses in progress."
            ctaLabel="Browse courses"
            ctaTo="/courses"
          />
        ) : (
          <S.CourseGrid>
            {inProgress.map((course) => (
              <CourseProgressCard
                key={course.course_id}
                courseId={course.course_id}
                title={course.title}
                description={course.description}
                completedLessons={course.completed_lessons}
                totalLessons={course.total_lessons}
                percentComplete={course.percent_complete}
              />
            ))}
          </S.CourseGrid>
        )}
      </S.Panel>

      <S.Panel>
        <S.PanelHeader>
          <S.PanelTitle>Activity</S.PanelTitle>
          <S.PanelSubtitle>Lessons completed over the last 7 days</S.PanelSubtitle>
        </S.PanelHeader>
        <EmptyState
          icon={InsightsIcon}
          message="Activity history isn't available yet."
          ctaLabel="Go to courses"
          ctaTo="/courses"
        />
      </S.Panel>
    </>
  )
}

const InstructorSection = (): React.ReactElement => {
  const { data, isLoading, isError, error } = useInstructorAnalytics()

  if (isLoading) {
    return (
      <>
        <LoadingStats />
        <LoadingRows />
      </>
    )
  }
  if (isError) return <InlineError message={error.message} />
  if (!data) return <InlineError message="Dashboard data is unavailable." />

  const totalEnrollments = data.reduce((sum, course) => sum + course.enrollment_count, 0)

  return (
    <>
      <S.StatGrid>
        <StatCard icon={MenuBookIcon} value={data.length} label="Courses published" />
        <StatCard icon={GroupsIcon} value={totalEnrollments} label="Total enrollments" />
      </S.StatGrid>

      <S.Panel>
        <S.PanelHeader>
          <S.PanelTitle>Course performance</S.PanelTitle>
        </S.PanelHeader>
        {data.length === 0 ? (
          <EmptyState
            icon={MenuBookIcon}
            message="You have not published any courses yet."
            ctaLabel="Go to courses"
            ctaTo="/courses"
          />
        ) : (
          <S.List>
            {data.map((course) => (
              <S.Row key={course.course_id}>
                <S.RowTitle>{course.title}</S.RowTitle>
                <S.RowMeta>
                  {course.enrollment_count} enrolled · {Math.round(course.completion_rate * 100)}%
                  completion
                </S.RowMeta>
              </S.Row>
            ))}
          </S.List>
        )}
      </S.Panel>
    </>
  )
}

const AdminSection = (): React.ReactElement => {
  const { data, isLoading, isError, error } = useAdminAnalytics()

  if (isLoading) {
    return (
      <>
        <LoadingStats />
        <LoadingRows />
      </>
    )
  }
  if (isError) return <InlineError message={error.message} />
  if (!data) return <InlineError message="Dashboard data is unavailable." />

  return (
    <>
      <S.StatGrid>
        <StatCard icon={GroupsIcon} value={data.active_users.total} label="Active users" />
        <StatCard icon={SchoolIcon} value={data.active_users.student} label="Students" />
        <StatCard icon={PeopleIcon} value={data.active_users.instructor} label="Instructors" />
        <StatCard
          icon={AdminPanelSettingsIcon}
          value={data.active_users.admin}
          label="Admins"
        />
      </S.StatGrid>

      <S.Panel>
        <S.PanelHeader>
          <S.PanelTitle>Top courses</S.PanelTitle>
        </S.PanelHeader>
        {data.top_courses.length === 0 ? (
          <EmptyState
            icon={MenuBookIcon}
            message="No course enrollments yet."
            ctaLabel="Go to courses"
            ctaTo="/courses"
          />
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
      </S.Panel>
    </>
  )
}

const SECTION_BY_ROLE: Record<UserRole, () => React.ReactElement> = {
  student: StudentSection,
  instructor: InstructorSection,
  admin: AdminSection,
}

const SUBLINE_BY_ROLE: Record<UserRole, string> = {
  student: "Here's where you left off.",
  instructor: "Here's how your courses are doing.",
  admin: "Here's what's happening across LearnHub.",
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { data: currentUser } = useCurrentUser()

  if (!user) return <S.Message>Loading…</S.Message>

  const Section = SECTION_BY_ROLE[user.role]
  const firstName = currentUser?.first_name?.trim()

  return (
    <AppShell navItems={NAV_BY_ROLE[user.role]}>
      <Container>
        <S.Body>
          <S.Greeting>
            <S.GreetingTitle>
              {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
            </S.GreetingTitle>
            <S.GreetingSubline>{SUBLINE_BY_ROLE[user.role]}</S.GreetingSubline>
          </S.Greeting>
          <Section />
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default Dashboard
