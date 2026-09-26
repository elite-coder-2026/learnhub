import { API_URL } from '../config/api'
import type {
  AdminAnalytics,
  InstructorCourseAnalytics,
  StudentDashboard,
} from '../types/dashboard'

interface ApiErrorBody {
  error?: string
}

interface Envelope<T> {
  data: T
}

async function getJson<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) message = body.error
    } catch {
      message = `Request failed (${response.status})`
    }
    throw new Error(message)
  }

  const body = (await response.json()) as Envelope<T>
  return body.data
}

export function fetchStudentDashboard(token: string): Promise<StudentDashboard> {
  return getJson<StudentDashboard>('/dashboard', token)
}

export function fetchInstructorAnalytics(
  token: string,
): Promise<InstructorCourseAnalytics[]> {
  return getJson<InstructorCourseAnalytics[]>('/courses/analytics', token)
}

export function fetchAdminAnalytics(token: string): Promise<AdminAnalytics> {
  return getJson<AdminAnalytics>('/admin/analytics', token)
}
