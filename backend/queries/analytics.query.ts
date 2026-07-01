import { pool } from '../config/db'
import { ActiveUserCounts, TopCourse } from '../types/analytics.type'

interface ActiveUserRoleCount {
  user_role: string
  count: number
}

export const findActiveUserCounts = async (): Promise<ActiveUserCounts> => {
  const result = await pool.query<ActiveUserRoleCount>(
    `SELECT user_role, COUNT(*)::int AS count
     FROM nx.users
     WHERE is_active = true
       AND deleted_at IS NULL
     GROUP BY user_role`
  )

  const counts: ActiveUserCounts = { student: 0, instructor: 0, admin: 0, total: 0 }
  for (const row of result.rows) {
    if (row.user_role === 'student' || row.user_role === 'instructor' || row.user_role === 'admin') {
      counts[row.user_role] = row.count
    }
    counts.total += row.count
  }
  return counts
}

export const findTopCoursesByEnrollment = async (limit: number): Promise<TopCourse[]> => {
  const result = await pool.query<TopCourse>(
    `SELECT c.id AS course_id,
            c.title,
            COUNT(e.id)::int AS enrollment_count
     FROM nx.courses c
     LEFT JOIN nx.enrollments e ON e.course_id = c.id AND e.deleted_at IS NULL
     WHERE c.deleted_at IS NULL
     GROUP BY c.id, c.title
     ORDER BY enrollment_count DESC
     LIMIT $1`,
    [limit]
  )
  return result.rows
}
