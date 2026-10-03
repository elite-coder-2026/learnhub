import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { fetchStudentDashboard } from '../services/dashboardService'
import type { StudentDashboard } from '../types/dashboard'

export interface EnrollmentProgressResult {
  progressByCourseId: Map<string, number>
  isLoading: boolean
}

export const useEnrollmentProgress = (): EnrollmentProgressResult => {
  const { user, token } = useAuth()
  const isStudent = user?.role === 'student'

  const { data, isLoading } = useQuery<StudentDashboard, Error>({
    queryKey: ['dashboard', 'student'],
    queryFn: async () => fetchStudentDashboard(token ?? ''),
    enabled: isStudent && token !== null,
  })

  const progressByCourseId = new Map<string, number>()
  for (const course of [...(data?.inProgress ?? []), ...(data?.completed ?? [])]) {
    progressByCourseId.set(course.course_id, course.percent_complete)
  }

  return { progressByCourseId, isLoading: isStudent && isLoading }
}
