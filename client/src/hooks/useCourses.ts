import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { listCourses } from '../services/courseService'
import type { Course } from '../types/course'
import type { PaginatedResponse } from '../types/pagination'

const PAGE_SIZE = 12

export function useCourses(): UseInfiniteQueryResult<
  InfiniteData<PaginatedResponse<Course>>,
  Error
> {
  return useInfiniteQuery<
    PaginatedResponse<Course>,
    Error,
    InfiniteData<PaginatedResponse<Course>>,
    [string],
    string | null
  >({
    queryKey: ['courses'],
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      listCourses({ cursor: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })
}
