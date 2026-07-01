import * as fraudQueries from '../queries/fraud.query'
import { checkEnrollmentForFraud } from '../utils/fraudClient'
import { FraudFlag, FraudFlagStatus, FraudFlagWithStudent } from '../types/fraud.type'
import { PaginatedResponse } from '../types/progress.type'
import { NotFoundError, ValidationError } from '../utils/errors'

export const evaluateEnrollmentForFraud = async (
  studentId: string,
  courseId: string,
  enrollmentId: string,
  enrolledAt: Date
): Promise<void> => {
  const result = await checkEnrollmentForFraud({
    student_id: studentId,
    course_id: courseId,
    enrollment_id: enrollmentId,
    enrolled_at: enrolledAt.toISOString()
  })

  if (!result || !result.is_fraud) return

  await fraudQueries.insertFraudFlag(studentId, courseId, enrollmentId, result.risk_score, result.reason)
}

export const listFraudFlags = async (
  cursor: string | null,
  limit: number,
  status: FraudFlagStatus | null
): Promise<PaginatedResponse<FraudFlagWithStudent>> => {
  const rows = await fraudQueries.findFraudFlagsPaginated(cursor, limit + 1, status)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}

export const reviewFraudFlag = async (
  flagId: string,
  reviewerId: string,
  status: FraudFlagStatus
): Promise<FraudFlag> => {
  if (status === 'pending') throw new ValidationError('Cannot set flag status back to pending')

  const existing = await fraudQueries.findFraudFlagById(flagId)
  if (!existing) throw new NotFoundError(`Fraud flag ${flagId} not found`)

  const updated = await fraudQueries.markFraudFlagReviewed(flagId, reviewerId, status)
  if (!updated) throw new NotFoundError(`Fraud flag ${flagId} not found`)

  return updated
}
