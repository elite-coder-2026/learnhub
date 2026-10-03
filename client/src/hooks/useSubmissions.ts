import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { gradeSubmission, listAssignmentSubmissions, listCourseAssignments } from '../services/assignmentService'
import type { Assignment, GradeSubmissionInput, SubmissionWithStudent } from '../types/assignment'
import type { PaginatedResponse } from '../types/pagination'

export const useCourseAssignments = (courseId: string | null): UseQueryResult<Assignment[], Error> => {
  const { token } = useAuth()
  return useQuery<Assignment[], Error>({
    queryKey: ['assignments', courseId],
    queryFn: async () => listCourseAssignments(courseId ?? '', token ?? ''),
    enabled: courseId !== null && token !== null,
  })
}

export const useAssignmentSubmissions = (
  assignmentId: string | null,
): UseInfiniteQueryResult<InfiniteData<PaginatedResponse<SubmissionWithStudent>>, Error> => {
  const { token } = useAuth()
  return useInfiniteQuery<
    PaginatedResponse<SubmissionWithStudent>,
    Error,
    InfiniteData<PaginatedResponse<SubmissionWithStudent>>,
    (string | null)[],
    string | null
  >({
    queryKey: ['submissions', assignmentId],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => listAssignmentSubmissions(assignmentId ?? '', pageParam, token ?? ''),
    getNextPageParam: (page) => (page.hasMore ? (page.nextCursor ?? undefined) : undefined),
    enabled: assignmentId !== null && token !== null,
  })
}

export interface GradeVariables {
  submissionId: string
  input: GradeSubmissionInput
}

export const useGradeSubmission = (): UseMutationResult<SubmissionWithStudent, Error, GradeVariables> => {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation<SubmissionWithStudent, Error, GradeVariables>({
    mutationFn: async ({ submissionId, input }) => gradeSubmission(submissionId, input, token ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

export const parseGrade = (value: string): number | null => {
  const trimmed = value.trim()
  if (!/^\d{1,3}$/.test(trimmed)) return null
  const grade = Number(trimmed)
  return grade <= 100 ? grade : null
}
