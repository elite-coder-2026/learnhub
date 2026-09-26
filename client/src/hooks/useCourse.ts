import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getCourse } from '../services/courseService'
import type { CourseWithStructure } from '../types/course'

export function useCourse(
  courseId: string | undefined,
): UseQueryResult<CourseWithStructure, Error> {
  return useQuery<CourseWithStructure, Error>({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId as string),
    enabled: courseId !== undefined,
  })
}
