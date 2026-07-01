import { pool } from '../config/db'
import { DiscussionPost, DiscussionPostWithAuthor } from '../types/discussion.type'

export const insertDiscussionPost = async (
  lessonId: string,
  authorId: string,
  body: string
): Promise<DiscussionPost> => {
  const result = await pool.query<DiscussionPost>(
    `INSERT INTO nx.discussion_posts (lesson_id, author_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, lesson_id, author_id, body, created_at, updated_at`,
    [lessonId, authorId, body]
  )
  return result.rows[0]
}

export const findDiscussionPostsByLessonId = async (
  lessonId: string,
  cursor: string | null,
  limit: number
): Promise<DiscussionPostWithAuthor[]> => {
  const result = await pool.query<DiscussionPostWithAuthor>(
    `SELECT p.id, p.lesson_id, p.author_id,
            u.first_name AS author_first_name,
            u.last_name AS author_last_name,
            u.user_role AS author_role,
            p.body, p.created_at
     FROM nx.discussion_posts p
     JOIN nx.users u ON u.id = p.author_id
     WHERE p.lesson_id = $1
       AND p.deleted_at IS NULL
       AND ($2::uuid IS NULL OR p.id > $2::uuid)
     ORDER BY p.id ASC
     LIMIT $3`,
    [lessonId, cursor, limit]
  )
  return result.rows
}
