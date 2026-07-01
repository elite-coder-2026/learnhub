import * as notificationQueries from '../queries/notification.query'
import { Notification, CreateNotificationInput } from '../types/notification.type'
import { PaginatedResponse } from '../types/progress.type'
import { NotFoundError, UnauthorizedError } from '../utils/errors'

const assertOwnership = (notification: Notification, userId: string): void => {
  if (notification.user_id !== userId) throw new UnauthorizedError('Not your notification')
}

export const createNotification = async (input: CreateNotificationInput): Promise<Notification> => {
  return notificationQueries.createNotification(input)
}

export const getNotificationsForUser = async (
  userId: string,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<Notification>> => {
  const rows = await notificationQueries.findNotificationsByUser(userId, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}

export const getUnreadCount = async (userId: string): Promise<number> => {
  return notificationQueries.countUnreadNotifications(userId)
}

export const markAsRead = async (userId: string, notificationId: string): Promise<Notification> => {
  const notification = await notificationQueries.findNotificationById(notificationId)
  if (!notification) throw new NotFoundError(`Notification ${notificationId} not found`)
  assertOwnership(notification, userId)

  const updated = await notificationQueries.markNotificationRead(notificationId)
  if (!updated) throw new NotFoundError(`Notification ${notificationId} not found`)
  return updated
}

export const markAllAsRead = async (userId: string): Promise<void> => {
  await notificationQueries.markAllNotificationsRead(userId)
}

export const deleteNotification = async (userId: string, notificationId: string): Promise<void> => {
  const notification = await notificationQueries.findNotificationById(notificationId)
  if (!notification) throw new NotFoundError(`Notification ${notificationId} not found`)
  assertOwnership(notification, userId)

  await notificationQueries.softDeleteNotification(notificationId)
}
