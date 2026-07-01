import { pool } from '../config/db'
import { DashboardCourse, LessonProgress, LessonStatus } from '../types/progress.type'

export const markLessonComplete = async (
  enrollmentId: string,
  lessonId: string
): Promise<LessonProgress> => {
  const result = await pool.query<LessonProgress>(
    `INSERT INTO nx.lesson_progress (enrollment_id, lesson_id, completed_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (enrollment_id, lesson_id) WHERE deleted_at IS NULL
     DO UPDATE SET completed_at = NOW(), updated_at = NOW()
     RETURNING id, enrollment_id, lesson_id, completed_at, created_at, updated_at`,
    [enrollmentId, lessonId]
  )
  return result.rows[0]
}

export const markLessonIncomplete = async (
  enrollmentId: string,
  lessonId: string
): Promise<LessonProgress | null> => {
  const result = await pool.query<LessonProgress>(
    `UPDATE nx.lesson_progress
     SET completed_at = NULL, updated_at = NOW()
     WHERE enrollment_id = $1
       AND lesson_id = $2
       AND deleted_at IS NULL
     RETURNING id, enrollment_id, lesson_id, completed_at, created_at, updated_at`,
    [enrollmentId, lessonId]
  )
  return result.rows[0] ?? null
}

export const findDashboardCoursesForStudent = async (studentId: string): Promise<DashboardCourse[]> => {
  const result = await pool.query<DashboardCourse>(
    `SELECT c.id AS course_id,
            c.title,
            c.description,
            COUNT(l.id)::int AS total_lessons,
            COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL)::int AS completed_lessons,
            CASE WHEN COUNT(l.id) = 0 THEN 0
                 ELSE ROUND(COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) * 100.0 / COUNT(l.id))::int
            END AS percent_complete
     FROM nx.enrollments e
     JOIN nx.courses c ON c.id = e.course_id AND c.deleted_at IS NULL
     LEFT JOIN nx.modules m ON m.course_id = c.id AND m.deleted_at IS NULL
     LEFT JOIN nx.lessons l ON l.module_id = m.id AND l.deleted_at IS NULL
     LEFT JOIN nx.lesson_progress lp ON lp.lesson_id = l.id AND lp.enrollment_id = e.id AND lp.deleted_at IS NULL
     WHERE e.student_id = $1
       AND e.deleted_at IS NULL
     GROUP BY c.id, c.title, c.description
     ORDER BY c.title `,
    [studentId]
  )
  return result.rows
}

export const findLessonStatusesForCourse = async (
  courseId: string,
  enrollmentId: string
): Promise<LessonStatus[]> => {
  const result = await pool.query<LessonStatus>(
    `SELECT l.id AS lesson_id,
            l.module_id,
            l.title,
            l.position,
            (lp.completed_at IS NOT NULL) AS completed,
            lp.completed_at
     FROM nx.lessons l
     JOIN nx.modules m ON m.id = l.module_id
     LEFT JOIN nx.lesson_progress lp
       ON lp.lesson_id = l.id
      AND lp.enrollment_id = $2
      AND lp.deleted_at IS NULL
     WHERE m.course_id = $1
       AND l.deleted_at IS NULL
       AND m.deleted_at IS NULL
     ORDER BY m.position , l.position `,
    [courseId, enrollmentId]
  )
  return result.rows
}
