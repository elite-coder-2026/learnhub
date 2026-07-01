import { pool } from '../config/db'
import { FraudFlag, FraudFlagStatus, FraudFlagWithStudent } from '../types/fraud.type'

const FRAUD_FLAG_COLUMNS = `id, student_id, course_id, enrollment_id, risk_score, reason, status, reviewed_by, reviewed_at, created_at, updated_at`

export const insertFraudFlag = async (
  studentId: string,
  courseId: string,
  enrollmentId: string,
  riskScore: number,
  reason: string | null
): Promise<FraudFlag> => {
  const result = await pool.query<FraudFlag>(
    `INSERT INTO nx.fraud_flags (student_id, course_id, enrollment_id, risk_score, reason)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${FRAUD_FLAG_COLUMNS}`,
    [studentId, courseId, enrollmentId, riskScore, reason]
  )
  return result.rows[0]
}

export const findFraudFlagById = async (id: string): Promise<FraudFlag | null> => {
  const result = await pool.query<FraudFlag>(
    `SELECT ${FRAUD_FLAG_COLUMNS}
     FROM nx.fraud_flags
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findFraudFlagsPaginated = async (
  cursor: string | null,
  limit: number,
  status: FraudFlagStatus | null
): Promise<FraudFlagWithStudent[]> => {
  const result = await pool.query<FraudFlagWithStudent>(
    `SELECT f.id, f.student_id, f.course_id, f.enrollment_id, f.risk_score, f.reason,
            f.status, f.reviewed_by, f.reviewed_at, f.created_at, f.updated_at,
            u.email AS student_email,
            u.first_name AS student_first_name,
            u.last_name AS student_last_name,
            c.title AS course_title
     FROM nx.fraud_flags f
     JOIN nx.users u ON u.id = f.student_id
     JOIN nx.courses c ON c.id = f.course_id
     WHERE f.deleted_at IS NULL
       AND ($3::text IS NULL OR f.status = $3)
       AND ($1::uuid IS NULL OR f.id > $1::uuid)
     ORDER BY f.id ASC
     LIMIT $2`,
    [cursor, limit, status]
  )
  return result.rows
}

export const markFraudFlagReviewed = async (
  id: string,
  reviewerId: string,
  status: FraudFlagStatus
): Promise<FraudFlag | null> => {
  const result = await pool.query<FraudFlag>(
    `UPDATE nx.fraud_flags
     SET status = $2,
         reviewed_by = $3,
         reviewed_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING ${FRAUD_FLAG_COLUMNS}`,
    [id, status, reviewerId]
  )
  return result.rows[0] ?? null
}
