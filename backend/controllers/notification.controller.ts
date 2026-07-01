import { Request, Response } from 'express'
import * as notificationService from '../services/notification.service'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { paramString } from '../utils/params'

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message })
    return
  }
  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await notificationService.getNotificationsForUser(userId, cursor, limit)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
}

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const count = await notificationService.getUnreadCount(userId)
    res.json({ data: { count } })
  } catch (error) {
    handleError(error, res)
  }
}

export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const notificationId = paramString(req.params.id)
    const notification = await notificationService.markAsRead(userId, notificationId)
    res.json({ data: notification })
  } catch (error) {
    handleError(error, res)
  }
}

export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    await notificationService.markAllAsRead(userId)
    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const notificationId = paramString(req.params.id)
    await notificationService.deleteNotification(userId, notificationId)
    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}
