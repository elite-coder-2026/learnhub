import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SchoolIcon from '@mui/icons-material/School'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getCategoryMeta } from '../../config/categories'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import CastForEducationIcon from '@mui/icons-material/CastForEducation'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import Button from '../../components/Button'
import CourseGrid from '../../components/CourseGrid'
import InstructorCard from '../../components/InstructorCard'
import InlineError from '../../components/InlineError'
import Skeleton from '../../components/Skeleton'
import { useTheme } from 'styled-components'
import { usePopularCourses, useTopInstructors } from '../../hooks/useHomeHighlights'
import { useAuth } from '../../hooks/useAuth'
import { useCourses } from '../../hooks/useCourses'
import type { Course } from '../../types/course'
import * as S from './Home.styles'

const NEW_COURSE_COUNT = 4
const HIGHLIGHT_COUNT = 4
const INSTRUCTOR_SKELETON_KEYS = ['instructor-a', 'instructor-b', 'instructor-c', 'instructor-d']
const CATEGORY_COUNT = 6
const NO_PROGRESS = new Map<string, number>()

interface CategorySummary {
  name: string
  count: number
}

const summarizeCategories = (courses: Course[]): CategorySummary[] => {
  const counts = new Map<string, number>()
  for (const course of courses) {
    if (course.category) counts.set(course.category, (counts.get(course.category) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, CATEGORY_COUNT)
}

const newestFirst = (courses: Course[]): Course[] =>
  [...courses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, NEW_COURSE_COUNT)

const VALUE_POINTS = [
  { icon: AutoStoriesIcon, title: 'Learn at your pace', text: 'Structured modules and lessons you can pick up anytime.' },
  { icon: CastForEducationIcon, title: 'Teach what you know', text: 'Instructors build courses with modules, lessons, and analytics.' },
  { icon: WorkspacePremiumIcon, title: 'Earn certificates', text: 'Finish a course and get a certificate of completion.' },
]

const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const { data, isLoading, isError, error } = useCourses({ search: '', level: null, category: null })
  const popular = usePopularCourses(HIGHLIGHT_COUNT)
  const instructors = useTopInstructors(HIGHLIGHT_COUNT)

  const courses = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])
  const categories = useMemo(() => summarizeCategories(courses), [courses])
  const newCourses = useMemo(() => newestFirst(courses), [courses])

  return (
    <S.Page>
      <S.Header>
        <S.HeaderInner>
          <S.Brand to="/">
            <S.LogoBadge aria-hidden="true">
              <SchoolIcon fontSize="inherit" />
            </S.LogoBadge>
            LearnHub
          </S.Brand>
          <S.HeaderNav aria-label="Main">
            <S.NavAnchor href="#categories">Categories</S.NavAnchor>
            <S.NavAnchor href="#popular-courses">Popular</S.NavAnchor>
            <S.NavAnchor href="#top-instructors">Instructors</S.NavAnchor>
            <S.NavAnchor href="#new-courses">New courses</S.NavAnchor>
          </S.HeaderNav>
          <S.HeaderActions>
            {user ? (
              <Button size="sm" onClick={() => navigate('/dashboard')}>
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </>
            )}
          </S.HeaderActions>
        </S.HeaderInner>
      </S.Header>

      <S.Main>
        <S.Hero>
          <S.HeroTitle>Learn essential skills for your career and life</S.HeroTitle>
          <S.HeroText>
            Explore practical courses in programming, data, design, and architecture, taught by instructors
            who build real software.
          </S.HeroText>
          <S.HeroActions>
            <Button size="lg" onClick={() => navigate(user ? '/dashboard' : '/register')}>
              {user ? 'Go to dashboard' : 'Get started free'}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/courses')}>
              Browse courses
            </Button>
          </S.HeroActions>
        </S.Hero>

        <S.ValueGrid>
          {VALUE_POINTS.map(({ icon: Icon, title, text }) => (
            <S.ValueCard key={title}>
              <S.IconBadge aria-hidden="true">
                <Icon fontSize="inherit" />
              </S.IconBadge>
              <S.CardTitle>{title}</S.CardTitle>
              <S.CardText>{text}</S.CardText>
            </S.ValueCard>
          ))}
        </S.ValueGrid>

        {categories.length > 0 && (
          <S.Section id="categories">
            <S.SectionTitle>Browse by category</S.SectionTitle>
            <S.CategoryGrid>
              {categories.map((category) => {
                const meta = getCategoryMeta(category.name)
                const Icon = meta.icon
                return (
                  <S.CategoryCard key={category.name} to={`/courses?category=${encodeURIComponent(category.name)}`}>
                    <S.CategoryIconBadge $color={meta.color} aria-hidden="true">
                      <Icon fontSize="inherit" />
                    </S.CategoryIconBadge>
                    <S.CardTitle>{category.name}</S.CardTitle>
                    <S.CardText>{meta.tagline}</S.CardText>
                    <S.CategoryFooter>
                      {category.count} {category.count === 1 ? 'course' : 'courses'}
                      <ArrowForwardIcon fontSize="inherit" aria-hidden="true" />
                    </S.CategoryFooter>
                  </S.CategoryCard>
                )
              })}
            </S.CategoryGrid>
          </S.Section>
        )}

        <S.Section id="popular-courses">
          <S.SectionTitle>Popular courses</S.SectionTitle>
          <CourseGrid
            courses={popular.data ?? []}
            isLoading={popular.isLoading}
            isError={popular.isError}
            errorMessage={popular.error?.message}
            emptyMessage="No courses are available yet."
            hasActiveFilters={false}
            viewerRole={user?.role ?? null}
            progressByCourseId={NO_PROGRESS}
            buildHref={(id) => `/courses/${id}`}
            onClearFilters={() => undefined}
          />
        </S.Section>

        <S.Section id="top-instructors">
          <S.SectionTitle>Top instructors</S.SectionTitle>
          {instructors.isLoading && (
            <S.InstructorGrid aria-busy="true" aria-label="Loading instructors">
              {INSTRUCTOR_SKELETON_KEYS.map((key) => (
                <Skeleton key={key} height={theme.sizes.thumbnail} radius="lg" />
              ))}
            </S.InstructorGrid>
          )}
          {instructors.isError && <InlineError message={instructors.error.message} />}
          {instructors.data && instructors.data.length === 0 && (
            <S.CardText>No instructors have published courses yet.</S.CardText>
          )}
          {instructors.data && instructors.data.length > 0 && (
            <S.InstructorGrid>
              {instructors.data.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </S.InstructorGrid>
          )}
        </S.Section>

        <S.Section id="new-courses">
          <S.SectionTitle>New courses</S.SectionTitle>
          <CourseGrid
            courses={newCourses}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="No courses are available yet."
            hasActiveFilters={false}
            viewerRole={user?.role ?? null}
            progressByCourseId={NO_PROGRESS}
            buildHref={(id) => `/courses/${id}`}
            onClearFilters={() => undefined}
          />
        </S.Section>
      </S.Main>

      <S.Footer>
        <S.FooterInner>
          <span>© {new Date().getFullYear()} LearnHub</span>
          <S.FooterLinks>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </S.FooterLinks>
        </S.FooterInner>
      </S.Footer>
    </S.Page>
  )
}

export default Home
