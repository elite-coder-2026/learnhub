import * as courseQueries from '../queries/course.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import * as reviewQueries from '../queries/review.query'
import { PaginatedResponse } from '../types/progress.type'
import { CourseRatingSummary, Review, ReviewWithStudent } from '../types/review.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'

export const submitReview = async (
  studentId: string,
  courseId: string,
  rating: number,
  comment: string | null
): Promise<Review> => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be an integer between 1 and 5')
  }

  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)

  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, courseId)
  if (!enrollment) throw new UnauthorizedError('Must be enrolled in this course to leave a review')

  return reviewQueries.upsertReview(studentId, courseId, rating, comment)
}

export const listReviewsForCourse = async (
  courseId: string,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<ReviewWithStudent> & { summary: CourseRatingSummary }> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)

  const rows = await reviewQueries.findReviewsForCourse(courseId, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  const summary = await reviewQueries.findRatingSummaryForCourse(courseId)

  return { data, nextCursor, hasMore, summary }
}

export const deleteReview = async (studentId: string, courseId: string): Promise<void> => {
  const deleted = await reviewQueries.softDeleteReview(studentId, courseId)
  if (!deleted) throw new NotFoundError('Review not found')
}
