import { pool } from '../config/db'
import { WishlistItem, WishlistCourse } from '../types/wishlist.type'

export const findWishlistItemByStudentAndCourse = async (
  studentId: string,
  courseId: string
): Promise<WishlistItem | null> => {
  const result = await pool.query<WishlistItem>(
    `SELECT id, student_id, course_id, created_at, updated_at
     FROM nx.wishlists
     WHERE student_id = $1
       AND course_id = $2
       AND deleted_at IS NULL`,
    [studentId, courseId]
  )
  return result.rows[0] ?? null
}

export const insertWishlistItem = async (
  studentId: string,
  courseId: string
): Promise<WishlistItem> => {
  const result = await pool.query<WishlistItem>(
    `INSERT INTO nx.wishlists (student_id, course_id)
     VALUES ($1, $2)
     RETURNING id, student_id, course_id, created_at, updated_at`,
    [studentId, courseId]
  )
  return result.rows[0]
}

export const softDeleteWishlistItem = async (id: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.wishlists
     SET deleted_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
}

export const findWishlistForStudent = async (
  studentId: string,
  cursor: string | null,
  limit: number
): Promise<WishlistCourse[]> => {
  const result = await pool.query<WishlistCourse>(
    `SELECT w.id AS wishlist_item_id,
            c.id AS course_id,
            c.title,
            c.description,
            c.category,
            c.instructor_id,
            w.created_at AS added_at
     FROM nx.wishlists w
     JOIN nx.courses c ON c.id = w.course_id
     WHERE w.student_id = $1
       AND w.deleted_at IS NULL
       AND c.deleted_at IS NULL
       AND ($2::uuid IS NULL OR w.id > $2::uuid)
     ORDER BY w.id ASC
     LIMIT $3`,
    [studentId, cursor, limit]
  )
  return result.rows
}
