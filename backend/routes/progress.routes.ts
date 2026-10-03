import { Router } from 'express'
import {
  getLesson,
  completeLesson,
  uncompleteLesson,
  getCourseProgress,
  getDashboard,
  getDashboardActivity
} from '../controllers/progress.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.get('/lessons/:lessonId', requireAuth, getLesson)
router.post('/lessons/:lessonId/complete', requireAuth, completeLesson)
router.delete('/lessons/:lessonId/complete', requireAuth, uncompleteLesson)
router.get('/courses/:courseId/progress', requireAuth, getCourseProgress)
router.get('/dashboard', requireAuth, getDashboard)
router.get('/dashboard/activity', requireAuth, getDashboardActivity)

export default router
