import { apiGet, apiGetRaw, apiPost } from './apiClient'
import type {
  Course,
  CourseLevel,
  PopularCourse,
  CourseWithStructure,
  CreateCourseInput,
  Enrollment,
} from '../types/course'
import type { PaginatedResponse } from '../types/pagination'

interface ListCoursesParams {
  cursor?: string | null
  limit?: number
  search?: string | null
  level?: CourseLevel | null
  category?: string | null
}

export const listCourses = async (
  params: ListCoursesParams,
): Promise<PaginatedResponse<Course>> => {
  const query = new URLSearchParams()
  if (params.cursor) query.set('cursor', params.cursor)
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.level) query.set('level', params.level)
  if (params.category) query.set('category', params.category)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiGetRaw<PaginatedResponse<Course>>(`/courses${suffix}`)
}

export function getCourse(courseId: string): Promise<CourseWithStructure> {
  return apiGet<CourseWithStructure>(`/courses/${courseId}`)
}

export function enrollInCourse(
  courseId: string,
  token: string,
): Promise<Enrollment> {
  return apiPost<Enrollment>(`/courses/${courseId}/enroll`, undefined, token)
}

export function createCourse(
  input: CreateCourseInput,
  token: string,
): Promise<CourseWithStructure> {
  return apiPost<CourseWithStructure>('/courses', input, token)
}

export const listPopularCourses = async (limit: number): Promise<PopularCourse[]> =>
  apiGet<PopularCourse[]>(`/courses/popular?limit=${limit}`)
