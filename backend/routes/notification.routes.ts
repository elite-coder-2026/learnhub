import { Router } from 'express'
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notification.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.get('/', requireAuth, getNotifications)
router.get('/unread-count', requireAuth, getUnreadCount)
router.put('/read-all', requireAuth, markAllNotificationsRead)
router.put('/:id/read', requireAuth, markNotificationRead)
router.delete('/:id', requireAuth, deleteNotification)

export default router
