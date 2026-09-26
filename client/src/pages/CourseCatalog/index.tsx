import { useNavigate } from 'react-router-dom'
import * as S from './CourseCatalog.styles'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import CourseGrid from '../../components/CourseGrid'
import { NAV_BY_ROLE } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import { useCourses } from '../../hooks/useCourses'
import type { Course } from '../../types/course'

const CourseCatalog: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCourses()

  const { user } = useAuth()
  const navigate = useNavigate()
  const isInstructor = user?.role === 'instructor'

  const courses: Course[] = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <AppShell navItems={user ? NAV_BY_ROLE[user.role] : []}>
      <Container>
        <S.Body>
          <PageHeader
            title="Courses"
            description="Browse the catalog and enroll to start learning."
            actions={
              isInstructor && (
                <Button onClick={() => navigate('/courses/new')}>
                  Create course
                </Button>
              )
            }
          />

          <CourseGrid
            courses={courses}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="No courses are available yet."
            buildHref={(id) => `/courses/${id}`}
          />

          {hasNextPage && (
            <S.LoadMoreRow>
              <Button
                variant="secondary"
                onClick={() => void fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Load more
              </Button>
            </S.LoadMoreRow>
          )}
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default CourseCatalog
