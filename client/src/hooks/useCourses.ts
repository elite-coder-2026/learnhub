import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { listCourses } from '../services/courseService'
import type { Course, CourseLevel } from '../types/course'
import type { PaginatedResponse } from '../types/pagination'

const PAGE_SIZE = 12

export interface CourseFilters {
  search: string
  level: CourseLevel | null
}

export const useCourses = (
  filters: CourseFilters,
): UseInfiniteQueryResult<InfiniteData<PaginatedResponse<Course>>, Error> => {
  const search = filters.search.trim() || null

  return useInfiniteQuery<
    PaginatedResponse<Course>,
    Error,
    InfiniteData<PaginatedResponse<Course>>,
    [string, string | null, CourseLevel | null],
    string | null
  >({
    queryKey: ['courses', search, filters.level],
    initialPageParam: null,
    queryFn: async ({ pageParam }) =>
      listCourses({ cursor: pageParam, limit: PAGE_SIZE, search, level: filters.level }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  })
}
