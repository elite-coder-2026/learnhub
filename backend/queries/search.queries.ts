import { pool } from '../config/db'
import { Course, CourseSearchFilters } from '../types/course.type'

export const searchCourses = async (
  query: string | null,
  filter: Omit<CourseSearchFilters, 'search'>,
  cursor: string | null,
  limit: number
): Promise<Course[]> => {
  const result = await pool.query<Course>(
    `WITH search AS (
       SELECT CASE WHEN $1::text IS NULL THEN NULL ELSE websearch_to_tsquery('english', $1::text) END AS query
     ),
     ranked AS (
       SELECT c.id, c.instructor_id, c.title, c.description, c.category, c.level, c.price_cents, c.created_at, c.updated_at,
              CASE WHEN s.query IS NULL THEN 0 ELSE ts_rank(c.search_vector, s.query) END AS rank
       FROM nx.courses c
       CROSS JOIN search s
       WHERE c.deleted_at IS NULL
         AND (s.query IS NULL OR c.search_vector @@ s.query)
         AND ($2::text IS NULL OR c.category = $2)
         AND ($3::uuid IS NULL OR c.instructor_id = $3::uuid)
         AND ($4::text IS NULL OR c.level::text = $4::text)
     )
     SELECT r.id, r.instructor_id, r.title, r.description, r.category, r.level, r.price_cents, r.created_at, r.updated_at
     FROM ranked r
     LEFT JOIN ranked cursor_row ON cursor_row.id = $5::uuid
     WHERE $5::uuid IS NULL
        OR r.rank < cursor_row.rank
        OR (r.rank = cursor_row.rank AND r.id > cursor_row.id)
     ORDER BY r.rank DESC, r.id ASC
     LIMIT $6`,
    [query, filter.category, filter.instructorId, filter.level, cursor, limit]
  )
  return result.rows
}
