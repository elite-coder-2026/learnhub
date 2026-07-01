import * as lessonQueries from '../queries/lesson.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import * as progressQueries from '../queries/progress.query'
import * as certificateService from './certificate.service'
import { Enrollment } from '../types/enrollment.type'
import { Lesson } from '../types/course.type'
import { CourseProgress, LessonProgress, StudentDashboard } from '../types/progress.type'
import { NotFoundError, UnauthorizedError } from '../utils/errors'

interface ResolvedEnrollment {
  enrollment: Enrollment
  courseId: string
}

const resolveEnrollment = async (studentId: string, lessonId: string): Promise<ResolvedEnrollment> => {
  const courseId = await lessonQueries.findCourseIdForLesson(lessonId)
  if (!courseId) throw new NotFoundError(`Lesson ${lessonId} not found`)

  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, courseId)
  if (!enrollment) throw new UnauthorizedError('Not enrolled in this course')

  return { enrollment, courseId }
}

export const getLessonContent = async (studentId: string, lessonId: string): Promise<Lesson> => {
  await resolveEnrollment(studentId, lessonId)

  const lesson = await lessonQueries.findLessonById(lessonId)
  if (!lesson) throw new NotFoundError(`Lesson ${lessonId} not found`)

  return lesson
}

export const completeLesson = async (studentId: string, lessonId: string): Promise<LessonProgress> => {
  const { enrollment, courseId } = await resolveEnrollment(studentId, lessonId)
  const progress = await progressQueries.markLessonComplete(enrollment.id, lessonId)

  void certificateService.issueCertificateIfEligible(studentId, courseId)

  return progress
}

export const uncompleteLesson = async (studentId: string, lessonId: string): Promise<LessonProgress> => {
  const { enrollment } = await resolveEnrollment(studentId, lessonId)
  const progress = await progressQueries.markLessonIncomplete(enrollment.id, lessonId)
  if (!progress) throw new NotFoundError(`No progress recorded for lesson ${lessonId}`)
  return progress
}

export const getProgressForCourse = async (
  studentId: string,
  courseId: string
): Promise<CourseProgress> => {
  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, courseId)
  if (!enrollment) throw new UnauthorizedError('Not enrolled in this course')

  const lessons = await progressQueries.findLessonStatusesForCourse(courseId, enrollment.id)
  const totalLessons = lessons.length
  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const percentComplete = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)

  return {
    course_id: courseId,
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    percent_complete: percentComplete,
    lessons
  }
}

export const getStudentDashboard = async (studentId: string): Promise<StudentDashboard> => {
  const courses = await progressQueries.findDashboardCoursesForStudent(studentId)

  const inProgress = courses.filter(
    (course) => course.total_lessons === 0 || course.completed_lessons < course.total_lessons
  )
  const completed = courses.filter(
    (course) => course.total_lessons > 0 && course.completed_lessons === course.total_lessons
  )

  return { inProgress, completed }
}
