import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { enrollInCourse } from '../services/courseService'
import type { Enrollment } from '../types/course'

export function useEnroll(
  courseId: string,
): UseMutationResult<Enrollment, Error, void> {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<Enrollment, Error, void>({
    mutationFn: () => enrollInCourse(courseId, token as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'student'] })
      void queryClient.invalidateQueries({ queryKey: ['course', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] })
    },
  })
}
