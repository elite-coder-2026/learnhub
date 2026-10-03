import { apiGet, apiGetRaw, apiPut } from './apiClient'
import type { Assignment, GradeSubmissionInput, SubmissionWithStudent } from '../types/assignment'
import type { PaginatedResponse } from '../types/pagination'

const PAGE_SIZE = 20

export const listCourseAssignments = async (courseId: string, token: string): Promise<Assignment[]> =>
  apiGet<Assignment[]>(`/courses/${courseId}/assignments`, token)

export const listAssignmentSubmissions = async (
  assignmentId: string,
  cursor: string | null,
  token: string,
): Promise<PaginatedResponse<SubmissionWithStudent>> => {
  const query = new URLSearchParams({ limit: String(PAGE_SIZE) })
  if (cursor) query.set('cursor', cursor)
  return apiGetRaw<PaginatedResponse<SubmissionWithStudent>>(`/assignments/${assignmentId}/submissions?${query.toString()}`, token)
}

export const gradeSubmission = async (
  submissionId: string,
  input: GradeSubmissionInput,
  token: string,
): Promise<SubmissionWithStudent> => apiPut<SubmissionWithStudent>(`/submissions/${submissionId}/grade`, input, token)
