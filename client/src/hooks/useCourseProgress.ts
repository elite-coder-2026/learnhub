import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getCourseProgress } from '../services/progressService'
import type { CourseProgress } from '../types/course'

export function useCourseProgress(
  courseId: string | undefined,
): UseQueryResult<CourseProgress, Error> {
  const { token } = useAuth()

  return useQuery<CourseProgress, Error>({
    queryKey: ['courseProgress', courseId],
    queryFn: () => getCourseProgress(courseId as string, token as string),
    enabled: courseId !== undefined && token !== null,
  })
}
