import { pool } from '../config/db'
import { Enrollment, EnrolledStudent } from '../types/enrollment.type'

export const findEnrollmentByStudentAndCourse = async (
  studentId: string,
  courseId: string
): Promise<Enrollment | null> => {
  const result = await pool.query<Enrollment>(
    `SELECT id, student_id, course_id, enrolled_at, created_at, updated_at
     FROM nx.enrollments
     WHERE student_id = $1
       AND course_id = $2
       AND deleted_at IS NULL`,
    [studentId, courseId]
  )
  return result.rows[0] ?? null
}

export const insertEnrollment = async (
  studentId: string,
  courseId: string
): Promise<Enrollment> => {
  const result = await pool.query<Enrollment>(
    `INSERT INTO nx.enrollments (student_id, course_id)
     VALUES ($1, $2)
     RETURNING id, student_id, course_id, enrolled_at, created_at, updated_at`,
    [studentId, courseId]
  )
  return result.rows[0]
}

export const findEnrolledStudentsForCourse = async (
  courseId: string,
  cursor: string | null,
  limit: number
): Promise<EnrolledStudent[]> => {
  const result = await pool.query<EnrolledStudent>(
    `SELECT e.id AS enrollment_id,
            u.id AS student_id,
            u.email,
            u.first_name,
            u.last_name,
            e.enrolled_at
     FROM nx.enrollments e
     JOIN nx.users u ON u.id = e.student_id
     WHERE e.course_id = $1
       AND e.deleted_at IS NULL
       AND ($2::uuid IS NULL OR e.id > $2::uuid)
     ORDER BY e.id ASC
     LIMIT $3`,
    [courseId, cursor, limit]
  )
  return result.rows
}
