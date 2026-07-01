import { pool } from '../config/db'
import { Assignment } from '../types/assignment.type'

export const insertAssignment = async (
  courseId: string,
  title: string,
  description: string | null
): Promise<Assignment> => {
  const result = await pool.query<Assignment>(
    `INSERT INTO nx.assignments (course_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING id, course_id, title, description, created_at, updated_at`,
    [courseId, title, description]
  )
  return result.rows[0]
}

export const findAssignmentById = async (id: string): Promise<Assignment | null> => {
  const result = await pool.query<Assignment>(
    `SELECT id, course_id, title, description, created_at, updated_at
     FROM nx.assignments
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findAssignmentsByCourseId = async (courseId: string): Promise<Assignment[]> => {
  const result = await pool.query<Assignment>(
    `SELECT id, course_id, title, description, created_at, updated_at
     FROM nx.assignments
     WHERE course_id = $1
       AND deleted_at IS NULL
     ORDER BY created_at ASC`,
    [courseId]
  )
  return result.rows
}
