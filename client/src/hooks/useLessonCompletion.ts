import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { completeLesson, uncompleteLesson } from '../services/progressService'

interface CompletionInput {
  lessonId: string
  completed: boolean
}

export function useLessonCompletion(
  courseId: string,
): UseMutationResult<void, Error, CompletionInput> {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<void, Error, CompletionInput>({
    mutationFn: ({ lessonId, completed }) =>
      completed
        ? completeLesson(lessonId, token as string)
        : uncompleteLesson(lessonId, token as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'student'] })
    },
  })
}
