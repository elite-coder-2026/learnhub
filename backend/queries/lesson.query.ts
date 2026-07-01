import { PoolClient } from 'pg'
import { pool } from '../config/db'
import { Lesson, DownloadableLesson } from '../types/course.type'

export const findCourseIdForLesson = async (lessonId: string): Promise<string | null> => {
  const result = await pool.query<{ course_id: string }>(
    `SELECT m.course_id
     FROM nx.lessons l
     JOIN nx.modules m ON m.id = l.module_id
     WHERE l.id = $1
       AND l.deleted_at IS NULL
       AND m.deleted_at IS NULL`,
    [lessonId]
  )
  return result.rows[0]?.course_id ?? null
}

export const findLessonsByModuleId = async (moduleId: string): Promise<Lesson[]> => {
  const result = await pool.query<Lesson>(
    `SELECT id, module_id, title, content_url, position, created_at, updated_at
     FROM nx.lessons
     WHERE module_id = $1
       AND deleted_at IS NULL
     ORDER BY position `,
    [moduleId]
  )
  return result.rows
}

export const findLessonById = async (id: string): Promise<Lesson | null> => {
  const result = await pool.query<Lesson>(
    `SELECT id, module_id, title, content_url, position, created_at, updated_at
     FROM nx.lessons
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findNextLessonPosition = async (moduleId: string): Promise<number> => {
  const result = await pool.query<{ next_position: number }>(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next_position
     FROM nx.lessons
     WHERE module_id = $1
       AND deleted_at IS NULL`,
    [moduleId]
  )
  return result.rows[0].next_position
}

export const addLesson = async (
  moduleId: string,
  title: string,
  contentUrl: string | null,
  position: number
): Promise<Lesson> => {
  const result = await pool.query<Lesson>(
    `INSERT INTO nx.lessons (module_id, title, content_url, position)
     VALUES ($1, $2, $3, $4)
     RETURNING id, module_id, title, content_url, position, created_at, updated_at`,
    [moduleId, title, contentUrl, position]
  )
  return result.rows[0]
}

export const updateLesson = async (
  id: string,
  title: string,
  contentUrl: string | null,
  position: number
): Promise<Lesson | null> => {
  const result = await pool.query<Lesson>(
    `UPDATE nx.lessons
     SET title = $2,
         content_url = $3,
         position = $4,
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id, module_id, title, content_url, position, created_at, updated_at`,
    [id, title, contentUrl, position]
  )
  return result.rows[0] ?? null
}

export const findLessonIdsByModuleId = async (moduleId: string): Promise<string[]> => {
  const result = await pool.query<{ id: string }>(
    `SELECT id
     FROM nx.lessons
     WHERE module_id = $1
       AND deleted_at IS NULL`,
    [moduleId]
  )
  return result.rows.map((row) => row.id)
}

export const setLessonPosition = async (client: PoolClient, id: string, position: number): Promise<void> => {
  await client.query(
    `UPDATE nx.lessons
     SET position = $2,
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id, position]
  )
}

export const findDownloadableLessonsForCourse = async (courseId: string): Promise<DownloadableLesson[]> => {
  const result = await pool.query<DownloadableLesson>(
    `SELECT l.id AS lesson_id,
            l.module_id,
            l.title,
            l.content_url
     FROM nx.lessons l
     JOIN nx.modules m ON m.id = l.module_id
     WHERE m.course_id = $1
       AND l.deleted_at IS NULL
       AND m.deleted_at IS NULL
     ORDER BY m.position , l.position `,
    [courseId]
  )
  return result.rows
}

export const softDeleteLesson = async (id: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.lessons
     SET deleted_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
}
