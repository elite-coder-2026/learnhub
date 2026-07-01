import * as courseQueries from '../queries/course.query'
import { createLessonContentUploadUrl } from '../utils/storage'
import { UploadUrlResponse } from '../types/storage.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'

const ALLOWED_CONTENT_TYPES = ['video/mp4', 'video/webm', 'application/pdf']

export const requestLessonUploadUrl = async (
  instructorId: string,
  courseId: string,
  contentType: string
): Promise<UploadUrlResponse> => {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new ValidationError(`contentType must be one of: ${ALLOWED_CONTENT_TYPES.join(', ')}`)
  }

  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)
  if (course.instructor_id !== instructorId) throw new UnauthorizedError('You do not own this course')

  return createLessonContentUploadUrl(courseId, contentType)
}
