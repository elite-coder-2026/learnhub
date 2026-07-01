import * as discussionQueries from '../queries/discussion.query'
import * as lessonQueries from '../queries/lesson.query'
import * as courseQueries from '../queries/course.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import { DiscussionPost, DiscussionPostWithAuthor } from '../types/discussion.type'
import { PaginatedResponse } from '../types/progress.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'

const assertLessonAccess = async (userId: string, userRole: string, lessonId: string): Promise<void> => {
  const courseId = await lessonQueries.findCourseIdForLesson(lessonId)
  if (!courseId) throw new NotFoundError(`Lesson ${lessonId} not found`)

  if (userRole === 'admin') return

  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)
  if (course.instructor_id === userId) return

  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(userId, courseId)
  if (!enrollment) throw new UnauthorizedError('Not enrolled in this course')
}

export const createDiscussionPost = async (
  userId: string,
  userRole: string,
  lessonId: string,
  body: string
): Promise<DiscussionPost> => {
  if (!body.trim()) throw new ValidationError('Post body is required')
  await assertLessonAccess(userId, userRole, lessonId)

  return discussionQueries.insertDiscussionPost(lessonId, userId, body.trim())
}

export const getDiscussionPostsForLesson = async (
  userId: string,
  userRole: string,
  lessonId: string,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<DiscussionPostWithAuthor>> => {
  await assertLessonAccess(userId, userRole, lessonId)

  const rows = await discussionQueries.findDiscussionPostsByLessonId(lessonId, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}
