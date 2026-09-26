import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { createCourse } from '../services/courseService'
import type { CourseWithStructure, CreateCourseInput } from '../types/course'

export function useCreateCourse(): UseMutationResult<
  CourseWithStructure,
  Error,
  CreateCourseInput
> {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<CourseWithStructure, Error, CreateCourseInput>({
    mutationFn: (input) => createCourse(input, token as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
