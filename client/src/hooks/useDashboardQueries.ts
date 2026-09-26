import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import {
  fetchAdminAnalytics,
  fetchInstructorAnalytics,
  fetchStudentDashboard,
} from '../services/dashboardService'
import type {
  AdminAnalytics,
  InstructorCourseAnalytics,
  StudentDashboard,
} from '../types/dashboard'

export function useStudentDashboard(): UseQueryResult<StudentDashboard, Error> {
  const { token } = useAuth()
  return useQuery<StudentDashboard, Error>({
    queryKey: ['dashboard', 'student'],
    queryFn: () => fetchStudentDashboard(token as string),
    enabled: token !== null,
  })
}

export function useInstructorAnalytics(): UseQueryResult<
  InstructorCourseAnalytics[],
  Error
> {
  const { token } = useAuth()
  return useQuery<InstructorCourseAnalytics[], Error>({
    queryKey: ['dashboard', 'instructor'],
    queryFn: () => fetchInstructorAnalytics(token as string),
    enabled: token !== null,
  })
}

export function useAdminAnalytics(): UseQueryResult<AdminAnalytics, Error> {
  const { token } = useAuth()
  return useQuery<AdminAnalytics, Error>({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => fetchAdminAnalytics(token as string),
    enabled: token !== null,
  })
}
