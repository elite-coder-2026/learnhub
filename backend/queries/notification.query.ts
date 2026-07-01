import { pool } from '../config/db'
import { Notification, CreateNotificationInput } from '../types/notification.type'

export const createNotification = async (input: CreateNotificationInput): Promise<Notification> => {
  const result = await pool.query<Notification>(
    `INSERT INTO nx.notifications (user_id, action_id, type, title, message, content_label, content_url, quote)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, user_id, action_id, type, title, message, content_label, content_url, quote, read_at, created_at, updated_at`,
    [
      input.userId,
      input.actionId,
      input.type,
      input.title,
      input.message,
      input.contentLabel,
      input.contentUrl,
      input.quote
    ]
  )
  return result.rows[0]
}

export const findNotificationById = async (id: string): Promise<Notification | null> => {
  const result = await pool.query<Notification>(
    `SELECT id, user_id, action_id, type, title, message, content_label, content_url, quote, read_at, created_at, updated_at
     FROM nx.notifications
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findNotificationsByUser = async (
  userId: string,
  cursor: string | null,
  limit: number
): Promise<Notification[]> => {
  const result = await pool.query<Notification>(
    `SELECT id, user_id, action_id, type, title, message, content_label, content_url, quote, read_at, created_at, updated_at
     FROM nx.notifications
     WHERE user_id = $1
       AND deleted_at IS NULL
       AND ($2::uuid IS NULL OR id > $2::uuid)
     ORDER BY id 
     LIMIT $3`,
    [userId, cursor, limit]
  )
  return result.rows
}

export const countUnreadNotifications = async (userId: string): Promise<number> => {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*) AS count
     FROM nx.notifications
     WHERE user_id = $1
       AND read_at IS NULL
       AND deleted_at IS NULL`,
    [userId]
  )
  return Number(result.rows[0].count)
}

export const markNotificationRead = async (id: string): Promise<Notification | null> => {
  const result = await pool.query<Notification>(
    `UPDATE nx.notifications
     SET read_at = NOW(), updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id, user_id, action_id, type, title, message, content_label, content_url, quote, read_at, created_at, updated_at`,
    [id]
  )
  return result.rows[0] ?? null
}

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.notifications
     SET read_at = NOW(), updated_at = NOW()
     WHERE user_id = $1
       AND read_at IS NULL
       AND deleted_at IS NULL`,
    [userId]
  )
}

export const softDeleteNotification = async (id: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.notifications
     SET deleted_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
}
