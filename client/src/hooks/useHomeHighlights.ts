import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { listPopularCourses } from '../services/courseService'
import { listTopInstructors } from '../services/userService'
import type { PopularCourse } from '../types/course'
import type { TopInstructor } from '../types/user'

export const usePopularCourses = (limit: number): UseQueryResult<PopularCourse[], Error> =>
  useQuery<PopularCourse[], Error>({
    queryKey: ['courses', 'popular', limit],
    queryFn: async () => listPopularCourses(limit),
  })

export const useTopInstructors = (limit: number): UseQueryResult<TopInstructor[], Error> =>
  useQuery<TopInstructor[], Error>({
    queryKey: ['instructors', 'top', limit],
    queryFn: async () => listTopInstructors(limit),
  })
