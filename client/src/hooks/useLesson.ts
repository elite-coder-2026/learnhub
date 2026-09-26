import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getLesson } from '../services/progressService'
import type { CourseLesson } from '../types/course'

export function useLesson(
  lessonId: string | undefined,
): UseQueryResult<CourseLesson, Error> {
  const { token } = useAuth()

  return useQuery<CourseLesson, Error>({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLesson(lessonId as string, token as string),
    enabled: lessonId !== undefined && token !== null,
  })
}
