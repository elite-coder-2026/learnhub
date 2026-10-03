import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import * as S from './CourseCatalog.styles'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import CourseGrid from '../../components/CourseGrid'
import Dropdown, { type DropdownOption } from '../../components/Dropdown'
import SearchInput from '../../components/SearchInput'
import { NAV_BY_ROLE } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import { useCourses } from '../../hooks/useCourses'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useEnrollmentProgress } from '../../hooks/useEnrollmentProgress'
import type { Course, CourseLevel } from '../../types/course'

type LevelFilter = CourseLevel | 'all'
type SortOption = 'newest' | 'title'

const SEARCH_DEBOUNCE_MS = 300

const LEVEL_OPTIONS: DropdownOption<LevelFilter>[] = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const SORT_OPTIONS: DropdownOption<SortOption>[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'title', label: 'Title (A–Z)' },
]

const sortCourses = (courses: Course[], sort: SortOption): Course[] =>
  [...courses].sort((a, b) =>
    sort === 'title'
      ? a.title.localeCompare(b.title)
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

const CourseCatalog: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<LevelFilter>('all')
  const [sort, setSort] = useState<SortOption>('newest')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useCourses({
    search: debouncedSearch,
    level: level === 'all' ? null : level,
  })
  const { progressByCourseId } = useEnrollmentProgress()

  const courses = useMemo(
    () => sortCourses(data?.pages.flatMap((page) => page.data) ?? [], sort),
    [data, sort],
  )
  const hasActiveFilters = search.trim() !== '' || level !== 'all'

  const clearFilters = (): void => {
    setSearch('')
    setLevel('all')
  }

  return (
    <AppShell navItems={user ? NAV_BY_ROLE[user.role] : []}>
      <Container>
        <S.Body>
          <S.HeaderCard>
            <S.TitleGroup>
              <S.Title>Courses</S.Title>
              <S.Subtitle>Browse the catalog and enroll to start learning.</S.Subtitle>
            </S.TitleGroup>
            <S.HeaderActions>
              <S.SearchSlot>
                <SearchInput
                  label="Search courses"
                  placeholder="Search courses"
                  value={search}
                  onChange={setSearch}
                />
              </S.SearchSlot>
              {user?.role === 'instructor' && (
                <Button onClick={() => navigate('/courses/new')}>
                  <AddIcon fontSize="inherit" />
                  Create course
                </Button>
              )}
            </S.HeaderActions>
          </S.HeaderCard>

          <S.FilterCard>
            <Dropdown<LevelFilter> label="Level" options={LEVEL_OPTIONS} value={level} onChange={setLevel} />
            <Dropdown<SortOption> label="Sort" options={SORT_OPTIONS} value={sort} onChange={setSort} />
          </S.FilterCard>

          <CourseGrid
            courses={courses}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage={hasActiveFilters ? 'No courses match your filters.' : 'No courses are available yet.'}
            hasActiveFilters={hasActiveFilters}
            viewerRole={user?.role ?? null}
            progressByCourseId={progressByCourseId}
            buildHref={(id) => `/courses/${id}`}
            onClearFilters={clearFilters}
          />

          {hasNextPage && (
            <S.LoadMoreRow>
              <Button variant="secondary" onClick={() => void fetchNextPage()} isLoading={isFetchingNextPage}>
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
