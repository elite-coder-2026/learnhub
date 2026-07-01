import { PoolClient } from 'pg'
import { pool } from '../config/db'
import { Course, CourseAnalytics, CourseSearchFilters, Module, Lesson } from '../types/course.type'

export const insertCourse = async (
  client: PoolClient,
  instructorId: string,
  title: string,
  description: string | null
): Promise<Course> => {
  const result = await client.query<Course>(
    `INSERT INTO nx.courses (instructor_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING id, instructor_id, title, description, category, level, created_at, updated_at`,
    [instructorId, title, description]
  )
  return result.rows[0]
}

export const insertModule = async (
  client: PoolClient,
  courseId: string,
  title: string,
  position: number
): Promise<Module> => {
  const result = await client.query<Module>(
    `INSERT INTO nx.modules (course_id, title, position)
     VALUES ($1, $2, $3)
     RETURNING id, course_id, title, position, created_at, updated_at`,
    [courseId, title, position]
  )
  return result.rows[0]
}

export const insertLesson = async (
  client: PoolClient,
  moduleId: string,
  title: string,
  contentUrl: string | null,
  position: number
): Promise<Lesson> => {
  const result = await client.query<Lesson>(
    `INSERT INTO nx.lessons (module_id, title, content_url, position)
     VALUES ($1, $2, $3, $4)
     RETURNING id, module_id, title, content_url, position, created_at, updated_at`,
    [moduleId, title, contentUrl, position]
  )
  return result.rows[0]
}

export const findCoursesPaginated = async (
  cursor: string | null,
  limit: number
): Promise<Course[]> => {
  const result = await pool.query<Course>(
    `SELECT id, instructor_id, title, description, category, level, created_at, updated_at
     FROM nx.courses
     WHERE deleted_at IS NULL
       AND ($1::uuid IS NULL OR id > $1::uuid)
     ORDER BY id 
     LIMIT $2`,
    [cursor, limit]
  )
  return result.rows
}

export const searchCoursesPaginated = async (
  filters: CourseSearchFilters,
  cursor: string | null,
  limit: number
): Promise<Course[]> => {
  const result = await pool.query<Course>(
    `SELECT id, instructor_id, title, description, category, level, created_at, updated_at
     FROM nx.courses
     WHERE deleted_at IS NULL
       AND ($1::text IS NULL OR title ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR category = $2)
       AND ($3::uuid IS NULL OR instructor_id = $3::uuid)
       AND ($4::varchar IS NULL OR level = $4::varchar)
       AND ($5::uuid IS NULL OR id > $5::uuid)
     ORDER BY id 
     LIMIT $6`,
    [filters.search, filters.category, filters.instructorId, filters.level, cursor, limit]
  )
  return result.rows
}

export const findAnalyticsForInstructor = async (instructorId: string): Promise<CourseAnalytics[]> => {
  const result = await pool.query<CourseAnalytics>(
    `WITH course_lesson_totals AS (
       SELECT c.id AS course_id, COUNT(l.id) AS total_lessons
       FROM nx.courses c
       LEFT JOIN nx.modules m ON m.course_id = c.id AND m.deleted_at IS NULL
       LEFT JOIN nx.lessons l ON l.module_id = m.id AND l.deleted_at IS NULL
       WHERE c.instructor_id = $1
         AND c.deleted_at IS NULL
       GROUP BY c.id
     ),
     enrollment_progress AS (
       SELECT e.id AS enrollment_id,
              e.course_id,
              COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) AS completed_lessons
       FROM nx.enrollments e
       JOIN course_lesson_totals clt ON clt.course_id = e.course_id
       LEFT JOIN nx.modules m ON m.course_id = e.course_id AND m.deleted_at IS NULL
       LEFT JOIN nx.lessons l ON l.module_id = m.id AND l.deleted_at IS NULL
       LEFT JOIN nx.lesson_progress lp
         ON lp.lesson_id = l.id
        AND lp.enrollment_id = e.id
        AND lp.deleted_at IS NULL
       WHERE e.deleted_at IS NULL
       GROUP BY e.id, e.course_id
     )
     SELECT c.id AS course_id,
            c.title,
            COUNT(ep.enrollment_id)::int AS enrollment_count,
            CASE WHEN COUNT(ep.enrollment_id) = 0 THEN 0
                 ELSE ROUND(
                   COUNT(ep.enrollment_id) FILTER (
                     WHERE clt.total_lessons > 0 AND ep.completed_lessons = clt.total_lessons
                   ) * 100.0 / COUNT(ep.enrollment_id)
                 )::int
            END AS completion_rate
     FROM nx.courses c
     JOIN course_lesson_totals clt ON clt.course_id = c.id
     LEFT JOIN enrollment_progress ep ON ep.course_id = c.id
     WHERE c.instructor_id = $1
       AND c.deleted_at IS NULL
     GROUP BY c.id, c.title
     ORDER BY c.title`,
    [instructorId]
  )
  return result.rows
}

export const findCourseById = async (id: string): Promise<Course | null> => {
  const result = await pool.query<Course>(
    `SELECT id, instructor_id, title, description, category, level, created_at, updated_at
     FROM nx.courses
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const updateCourse = async (
  id: string,
  title: string,
  description: string | null
): Promise<Course | null> => {
  const result = await pool.query<Course>(
    `UPDATE nx.courses
     SET title = $2,
         description = $3,
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id, instructor_id, title, description, category, level, created_at, updated_at`,
    [id, title, description]
  )
  return result.rows[0] ?? null
}

export const findModulesByCourseId = async (courseId: string): Promise<Module[]> => {
  const result = await pool.query<Module>(
    `SELECT id, course_id, title, position, created_at, updated_at
     FROM nx.modules
     WHERE course_id = $1
       AND deleted_at IS NULL
     ORDER BY position`,
    [courseId]
  )
  return result.rows
}

export const findModuleById = async (id: string): Promise<Module | null> => {
  const result = await pool.query<Module>(
    `SELECT id, course_id, title, position, created_at, updated_at
     FROM nx.modules
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findNextModulePosition = async (courseId: string): Promise<number> => {
  const result = await pool.query<{ next_position: number }>(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next_position
     FROM nx.modules
     WHERE course_id = $1
       AND deleted_at IS NULL`,
    [courseId]
  )
  return result.rows[0].next_position
}

export const addModule = async (courseId: string, title: string, position: number): Promise<Module> => {
  const result = await pool.query<Module>(
    `INSERT INTO nx.modules (course_id, title, position)
     VALUES ($1, $2, $3)
     RETURNING id, course_id, title, position, created_at, updated_at`,
    [courseId, title, position]
  )
  return result.rows[0]
}

export const updateModule = async (id: string, title: string, position: number): Promise<Module | null> => {
  const result = await pool.query<Module>(
    `UPDATE nx.modules
     SET title = $2,
         position = $3,
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id, course_id, title, position, created_at, updated_at`,
    [id, title, position]
  )
  return result.rows[0] ?? null
}

export const softDeleteCourse = async (id: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.courses
     SET deleted_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
}

export const softDeleteModule = async (id: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.modules
     SET deleted_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
}
