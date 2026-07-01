import * as courseQueries from '../queries/course.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import * as userQueries from '../queries/user.query'
import { evaluateEnrollmentForFraud } from './fraud.service'
import { Course, CourseSearchFilters } from '../types/course.type'
import { Enrollment, EnrolledStudent } from '../types/enrollment.type'
import { PaginatedResponse } from '../types/progress.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { sendEmail } from '../utils/mailer'

export const browseCourses = async (
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<Course>> => {
  const rows = await courseQueries.findCoursesPaginated(cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null
  return { data, nextCursor, hasMore }
}

export const searchCourses = async (
  filters: CourseSearchFilters,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<Course>> => {
  const rows = await courseQueries.searchCoursesPaginated(filters, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null
  return { data, nextCursor, hasMore }
}

export const enrollInCourse = async (studentId: string, courseId: string): Promise<Enrollment> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)

  const existing = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, courseId)
  if (existing) throw new ValidationError('Already enrolled in this course')

  const enrollment = await enrollmentQueries.insertEnrollment(studentId, courseId)

  void evaluateEnrollmentForFraud(studentId, courseId, enrollment.id, enrollment.enrolled_at).catch((error) =>
    console.error('Fraud evaluation failed — failing open', error)
  )

  const student = await userQueries.findUserById(studentId)
  if (student) {
    void sendEmail({
      to: student.email,
      subject: `You're enrolled in ${course.title}`,
      text: `Hi ${student.first_name ?? 'there'}, you're now enrolled in "${course.title}". Happy learning!`
    })
  }

  return enrollment
}

export const getEnrolledStudents = async (
  instructorId: string,
  courseId: string,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<EnrolledStudent>> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)
  if (course.instructor_id !== instructorId) throw new UnauthorizedError('You do not own this course')

  const rows = await enrollmentQueries.findEnrolledStudentsForCourse(courseId, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].enrollment_id : null

  return { data, nextCursor, hasMore }
}
