import * as userQueries from '../queries/user.query'
import * as courseQueries from '../queries/course.query'
import * as analyticsQueries from '../queries/analytics.query'
import { PlatformAnalytics } from '../types/analytics.type'
import { Course } from '../types/course.type'
import { PaginatedResponse } from '../types/progress.type'
import { User } from '../types/user.type'
import { NotFoundError } from '../utils/errors'

export const listUsers = async (
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<User>> => {
  const rows = await userQueries.findUsersPaginated(cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}

export const deactivateUser = async (userId: string): Promise<void> => {
  const user = await userQueries.findUserById(userId)
  if (!user) throw new NotFoundError(`User ${userId} not found`)

  await userQueries.deleteUser(userId)
}

export const listCourses = async (
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<Course>> => {
  const rows = await courseQueries.findCoursesPaginated(cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}

export const removeCourse = async (courseId: string): Promise<void> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)

  await courseQueries.softDeleteCourse(courseId)
}

export const getPlatformAnalytics = async (topCoursesLimit: number): Promise<PlatformAnalytics> => {
  const [activeUsers, topCourses] = await Promise.all([
    analyticsQueries.findActiveUserCounts(),
    analyticsQueries.findTopCoursesByEnrollment(topCoursesLimit)
  ])

  return { active_users: activeUsers, top_courses: topCourses }
}

export { listFraudFlags, reviewFraudFlag } from './fraud.service'
