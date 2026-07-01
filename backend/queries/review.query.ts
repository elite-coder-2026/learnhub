import { pool } from '../config/db'
import { CourseRatingSummary, Review, ReviewWithStudent } from '../types/review.type'

export const upsertReview = async (
  studentId: string,
  courseId: string,
  rating: number,
  comment: string | null
): Promise<Review> => {
  const result = await pool.query<Review>(
    `INSERT INTO nx.reviews (course_id, student_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (course_id, student_id) WHERE deleted_at IS NULL
     DO UPDATE SET rating = $3, comment = $4, updated_at = NOW()
     RETURNING id, course_id, student_id, rating, comment, created_at, updated_at`,
    [courseId, studentId, rating, comment]
  )
  return result.rows[0]
}

export const findReviewsForCourse = async (
  courseId: string,
  cursor: string | null,
  limit: number
): Promise<ReviewWithStudent[]> => {
  const result = await pool.query<ReviewWithStudent>(
    `SELECT r.id, r.course_id, r.student_id, r.rating, r.comment, r.created_at, r.updated_at,
            u.first_name, u.last_name
     FROM nx.reviews r
     JOIN nx.users u ON u.id = r.student_id
     WHERE r.course_id = $1
       AND r.deleted_at IS NULL
       AND ($2::uuid IS NULL OR r.id > $2::uuid)
     ORDER BY r.id 
     LIMIT $3`,
    [courseId, cursor, limit]
  )
  return result.rows
}

export const findRatingSummaryForCourse = async (courseId: string): Promise<CourseRatingSummary> => {
  const result = await pool.query<CourseRatingSummary>(
    `SELECT COALESCE(ROUND(AVG(rating), 2), 0)::float AS average_rating,
            COUNT(*)::int AS review_count
     FROM nx.reviews
     WHERE course_id = $1
       AND deleted_at IS NULL`,
    [courseId]
  )
  return result.rows[0]
}

export const softDeleteReview = async (studentId: string, courseId: string): Promise<Review | null> => {
  const result = await pool.query<Review>(
    `UPDATE nx.reviews
     SET deleted_at = NOW()
     WHERE student_id = $1
       AND course_id = $2
       AND deleted_at IS NULL
     RETURNING id, course_id, student_id, rating, comment, created_at, updated_at`,
    [studentId, courseId]
  )
  return result.rows[0] ?? null
}
