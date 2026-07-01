import { Router } from 'express'
import {
  listUsers,
  deactivateUser,
  listCourses,
  removeCourse,
  getAnalytics,
  listFraudFlags,
  reviewFraudFlag
} from '../controllers/admin.controller'
import { requireAuth, requireRole } from '../middleware/authMiddleware'

const router = Router()

router.use(requireAuth, requireRole('admin'))

router.get('/users', listUsers)
router.put('/users/:id/deactivate', deactivateUser)
router.get('/courses', listCourses)
router.delete('/courses/:id', removeCourse)
router.get('/analytics', getAnalytics)
router.get('/fraud-flags', listFraudFlags)
router.put('/fraud-flags/:id/review', reviewFraudFlag)

export default router
