import { apiDelete, apiGetRaw, apiPut } from './apiClient'
import type { AdminUser, FraudFlag, FraudFlagStatus } from '../types/admin'
import type { Course } from '../types/course'
import type { PaginatedResponse } from '../types/pagination'

const PAGE_SIZE = 20

const withCursor = (path: string, cursor: string | null, extra: Record<string, string> = {}): string => {
  const query = new URLSearchParams({ limit: String(PAGE_SIZE), ...extra })
  if (cursor) query.set('cursor', cursor)
  return `${path}?${query.toString()}`
}

export const listAdminUsers = async (cursor: string | null, token: string): Promise<PaginatedResponse<AdminUser>> =>
  apiGetRaw<PaginatedResponse<AdminUser>>(withCursor('/admin/users', cursor), token)

export const deactivateUser = async (userId: string, token: string): Promise<AdminUser> =>
  apiPut<AdminUser>(`/admin/users/${userId}/deactivate`, undefined, token)

export const listAdminCourses = async (cursor: string | null, token: string): Promise<PaginatedResponse<Course>> =>
  apiGetRaw<PaginatedResponse<Course>>(withCursor('/admin/courses', cursor), token)

export const removeCourse = async (courseId: string, token: string): Promise<void> =>
  apiDelete(`/admin/courses/${courseId}`, token)

export const listFraudFlags = async (
  cursor: string | null,
  status: FraudFlagStatus | null,
  token: string,
): Promise<PaginatedResponse<FraudFlag>> =>
  apiGetRaw<PaginatedResponse<FraudFlag>>(withCursor('/admin/fraud-flags', cursor, status ? { status } : {}), token)

export const reviewFraudFlag = async (flagId: string, status: FraudFlagStatus, token: string): Promise<FraudFlag> =>
  apiPut<FraudFlag>(`/admin/fraud-flags/${flagId}/review`, { status }, token)
